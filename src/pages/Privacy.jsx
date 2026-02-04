const Privacy = () => {
  const lastUpdated = 'February 1, 2026';

  const sections = [
    {
      title: 'Introduction',
      content: `Welcome to VaalHub ("we", "our", "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at vaalhub.co.za. Please read this policy carefully. If you disagree with its terms, please discontinue use of the site immediately.`,
    },
    {
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you subscribe to our newsletter or fill out an advertising inquiry form. The types of information we may collect include:\n\n• Email address (for newsletter subscriptions)\n• Name, business name, phone number, and email (for advertising inquiries)\n• Any other information you choose to provide in your communications with us\n\nWe also automatically collect certain technical information when you visit our site, including:\n\n• IP address\n• Browser type and version\n• Operating system\n• Pages visited and time spent\n• Referring URLs\n• Google Analytics data`,
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect to:\n\n• Send you newsletter updates about local news, events, and happenings in the Vaal Triangle\n• Respond to your advertising inquiries and process advertising requests\n• Improve and personalise your experience on our website\n• Monitor and analyse trends and usage\n• Detect and prevent fraudulent or illegal activities\n• Comply with legal obligations`,
    },
    {
      title: 'Information Sharing',
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:\n\n• With service providers who assist us in operating our website (e.g., hosting providers, analytics services)\n• When required by law or legal process\n• To protect the rights, property, or safety of VaalHub, our users, or the public\n• With your explicit consent`,
    },
    {
      title: 'Cookies and Tracking',
      content: `Our website uses cookies and similar tracking technologies to enhance your experience. We use Google Analytics to understand how visitors interact with our site. You can control cookie settings through your browser. By continuing to use our site, you consent to our use of cookies as described in this policy.`,
    },
    {
      title: 'Data Storage and Security',
      content: `Your information is stored securely using industry-standard practices. Newsletter and advertising form submissions are stored in Google Sheets and processed via Google Apps Script. We implement reasonable security measures to protect your information from unauthorised access, alteration, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
    },
    {
      title: 'Your Rights',
      content: `You have the right to:\n\n• Access the personal information we hold about you\n• Request correction of inaccurate information\n• Request deletion of your personal data\n• Opt out of newsletter communications at any time by contacting us\n• Lodge a complaint with a relevant data protection authority\n\nTo exercise any of these rights, please contact us via email at info@vaalhub.co.za.`,
    },
    {
      title: 'Data Retention',
      content: `We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, unless a longer retention period is required by law. Newsletter subscriber data is retained until you request unsubscription. Advertising inquiry data is retained for the duration of the business relationship and for a reasonable period thereafter.`,
    },
    {
      title: 'Third-Party Links',
      content: `Our website may contain links to third-party websites. We are not responsible for the privacy practices of these third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.`,
    },
    {
      title: 'Children\'s Privacy',
      content: `Our website is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately so that we can delete it.`,
    },
    {
      title: 'Changes to This Privacy Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by updating the "Last Updated" date at the top of this page. We encourage you to review this policy periodically. Your continued use of our website after any changes constitutes acceptance of the updated policy.`,
    },
    {
      title: 'Contact Us',
      content: `If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us:\n\n• Email: info@vaalhub.co.za\n• Website: vaalhub.co.za`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`p-8 ${index !== sections.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                <span className="text-vaal-orange-500 mr-2">{index + 1}.</span>
                {section.title}
              </h2>
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Back to top */}
        <div className="mt-8 text-center">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-vaal-orange-500 hover:text-vaal-orange-600 text-sm font-medium"
          >
            Back to top
          </a>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
