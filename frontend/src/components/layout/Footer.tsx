function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-label-md text-label-md text-on-surface mb-2">{title}</span>
      {links.map((l) => (
        <a
          key={l}
          href="#"
          className="font-body-sm text-body-sm text-on-secondary-container hover:text-primary transition-colors"
        >
          {l}
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-secondary-container border-t border-outline-variant">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg grid grid-cols-1 md:grid-cols-4 gap-stack-md">
        <div className="flex flex-col gap-4">
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
            GadiSewa
          </span>
          <p className="font-body-sm text-body-sm text-on-secondary-container">
            The fastest and most reliable way to secure transport in Nepal.
          </p>
        </div>
        <FooterCol title="Company" links={['About Us', 'Terms of Service', 'Privacy Policy']} />
        <FooterCol title="Services" links={['List Your Vehicle', 'Partner with Us', 'Contact Support']} />
        <div className="flex flex-col gap-4">
          <span className="font-label-md text-label-md text-on-surface mb-2">Follow Us</span>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-on-secondary-container cursor-pointer hover:text-primary">
              share
            </span>
            <span className="material-symbols-outlined text-on-secondary-container cursor-pointer hover:text-primary">
              public
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-secondary-container mt-auto">
            © 2024 GadiSewa Nepal. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
