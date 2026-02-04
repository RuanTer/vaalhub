const Terms = () => {
  const lastUpdated = 'February 1, 2026';

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing or using VaalHub ("the website", "the service", "we", "us", "our") at vaalhub.co.za, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our website. These Terms apply to all visitors, users, and others who access or use the service.`,
    },
    {
      title: 'Changes to Terms',
      content: `We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 14 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to use our website after changes take effect, you agree to the revised Terms.`,
    },
    {
      title: 'Use of the Website',
      content: `You agree to use VaalHub only for lawful purposes and in a manner that does not infringe upon the rights of others. You must not:\n\n• Use the website in any way that violates applicable local, national, or international law\n• Attempt to gain unauthorised access to any part of the website or its related systems\n• Use automated tools to scrape, crawl, or extract data from the website without permission\n• Transmit any harmful, offensive, or disruptive content\n• Impersonate any person or entity or misrepresent your affiliation with any person or entity\n• Interfere with or disrupt the integrity or performance of the website`,
    },
    {
      title: 'Intellectual Property',
      content: `The content on VaalHub, including but not limited to text, graphics, logos, images, audio clips, and software, is owned by or licensed to VaalHub and is protected by intellectual property laws. You may not reproduce, distribute, modify, create derivative works, or otherwise exploit any content on the website without our prior written consent.\n\nThe VaalHub name, logo, and associated trademarks are trademarks of VaalHub. You may not use our trademarks without prior written permission.`,
    },
    {
      title: 'Newsletter and Communications',
      content: `By subscribing to our newsletter, you agree to receive periodic emails containing local news, events, and updates from the Vaal Triangle. You may unsubscribe at any time by contacting us at info@vaalhub.co.za. We will process unsubscription requests within a reasonable timeframe.\n\nYou agree that the information you provide when subscribing is accurate and up to date.`,
    },
    {
      title: 'Advertising',
      content: `If you choose to place an advertisement through VaalHub, you agree to the following:\n\n• All advertising content must comply with applicable laws and regulations\n• Advertisers are responsible for the accuracy and legality of their advertisement content\n• VaalHub reserves the right to reject or remove any advertisement that violates our policies or applicable law\n• Payment terms and conditions will be communicated separately upon agreement\n• VaalHub is not liable for any claims arising from advertising content`,
    },
    {
      title: 'User-Generated Content',
      content: `If you submit any content to VaalHub (including news submissions, comments, or suggestions), you grant us a non-exclusive, worldwide, royalty-free licence to use, modify, reproduce, and distribute that content in connection with the service. You represent that you own or have the necessary rights to share the content you submit.`,
    },
    {
      title: 'Limitation of Liability',
      content: `To the fullest extent permitted by applicable law, VaalHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with your use of the website.\n\nVaalHub's total liability to you shall not exceed the amount you have paid to VaalHub in the 12 months preceding the event giving rise to the claim, or R1,000 (South African Rand), whichever is greater.`,
    },
    {
      title: 'Disclaimer of Warranties',
      content: `The website is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. VaalHub does not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components. VaalHub does not warrant the accuracy or completeness of any information provided on the website.`,
    },
    {
      title: 'Third-Party Content',
      content: `VaalHub may include links to third-party websites or services. These third-party sites are not under our control, and we are not responsible for their content or privacy practices. By using our website, you acknowledge that we are not liable for any loss or damage that may arise from your use of third-party sites.`,
    },
    {
      title: 'Governing Law',
      content: `These Terms shall be governed by and construed in accordance with the laws of the Republic of South Africa, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Gauteng, South Africa.`,
    },
    {
      title: 'Termination',
      content: `We may terminate or suspend your access to the website immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the website will immediately cease.`,
    },
    {
      title: 'Entire Agreement',
      content: `These Terms constitute the entire agreement between you and VaalHub regarding the use of our website and supersede all prior agreements or understandings. If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will continue in full force and effect.`,
    },
    {
      title: 'Contact Us',
      content: `If you have any questions about these Terms of Service, please contact us:\n\n• Email: info@vaalhub.co.za\n• Website: vaalhub.co.za`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
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

export default Terms;
