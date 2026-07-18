import crypto from 'crypto';
import { env } from '../config/env';

/**
 * eSewa ePay v2 HMAC-SHA256 signing, per their published spec:
 * message = "field1=value1,field2=value2,..." (exact field order matters),
 * HMAC-SHA256 with the merchant secret key, base64-encoded.
 */
function sign(fields: Record<string, string | number>, order: string[]): string {
  const message = order.map((f) => `${f}=${fields[f]}`).join(',');
  return crypto.createHmac('sha256', env.ESEWA_SECRET_KEY).update(message).digest('base64');
}

export interface EsewaFormFields {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

/** Build the signed form fields eSewa expects for the initial payment POST. */
export function buildEsewaPaymentForm(params: {
  totalAmount: number;
  transactionUuid: string;
  successUrl: string;
  failureUrl: string;
}): { url: string; fields: EsewaFormFields } {
  const signedFieldNames = ['total_amount', 'transaction_uuid', 'product_code'];
  const signature = sign(
    {
      total_amount: params.totalAmount,
      transaction_uuid: params.transactionUuid,
      product_code: env.ESEWA_MERCHANT_CODE,
    },
    signedFieldNames
  );

  return {
    url: env.ESEWA_FORM_URL,
    fields: {
      amount: String(params.totalAmount),
      tax_amount: '0',
      total_amount: String(params.totalAmount),
      transaction_uuid: params.transactionUuid,
      product_code: env.ESEWA_MERCHANT_CODE,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: params.successUrl,
      failure_url: params.failureUrl,
      signed_field_names: signedFieldNames.join(','),
      signature,
    },
  };
}

export interface EsewaCallbackPayload {
  transaction_code: string;
  status: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  signed_field_names: string;
  signature: string;
  [key: string]: string;
}

/** Decode the base64 `data` query param eSewa redirects back with. */
export function decodeEsewaCallback(data: string): EsewaCallbackPayload {
  const json = Buffer.from(data, 'base64').toString('utf-8');
  return JSON.parse(json);
}

/**
 * Verify the callback is authentically from eSewa: recompute the HMAC over
 * exactly the fields it says it signed (`signed_field_names`), in that
 * order, and compare to the `signature` it sent. This is the authoritative
 * check — eSewa signs the response with our shared secret, so a match
 * proves the payload wasn't forged or tampered with in transit.
 */
export function verifyEsewaCallback(payload: EsewaCallbackPayload): boolean {
  const order = payload.signed_field_names.split(',');
  const expected = sign(payload, order);
  return expected === payload.signature;
}
