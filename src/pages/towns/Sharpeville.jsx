import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { townHistories } from '../../data/townHistories';

const Sharpeville = () => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const history = townHistories.sharpeville;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1518176258769-f227c798150e?w=1200)',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-vaal-orange-400 font-medium mb-2">Heritage Guide</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sharpeville</h1>
            <p className="text-xl text-gray-200">
              A Place of Global Historical Importance
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            <div className="article-content prose prose-lg max-w-none">
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Overview</h2>
                <p>
                  Sharpeville holds a unique and profound place in South African and world history. It is internationally recognised for its role in the struggle for human rights and the fight against apartheid.
                </p>
              </section>

              <section className="mb-12 bg-gray-50 p-6 rounded-lg border-l-4 border-vaal-orange-500">
                <h2 className="text-3xl font-bold mb-6">Historical Significance</h2>
                <p>
                  On 21 March 1960, the Sharpeville Massacre occurred when police opened fire on peaceful protestors opposing pass laws. This event marked a turning point in South African history and led to global condemnation of apartheid.
                </p>
                <p>
                  The massacre resulted in 69 deaths and over 180 injuries. It became a catalyst for international action against apartheid and is commemorated annually on Human Rights Day in South Africa.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsHistoryModalOpen(true)}
                    className="px-4 py-2 bg-vaal-orange-500 text-white rounded-md hover:bg-vaal-orange-600 transition-colors text-sm font-medium"
                  >
                    View More History
                  </button>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Key Heritage Sites</h2>
                <h3 className="text-2xl font-bold mb-4">Sharpeville Human Rights Precinct</h3>
                <p>
                  The Sharpeville Human Rights Precinct is a national heritage site that serves as a memorial and educational centre. It includes:
                </p>
                <ul>
                  <li>Memorial gardens and monuments</li>
                  <li>Educational and commemorative spaces</li>
                  <li>Documentation and archival materials</li>
                  <li>Community gathering areas</li>
                </ul>
                <p>
                  The precinct was officially opened by President Nelson Mandela in 2001 and continues to serve as a place of remembrance and education.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Things to Do (Heritage Tourism)</h2>
                <p>Sharpeville offers important opportunities for respectful heritage tourism:</p>
                <ul>
                  <li><strong>Guided historical tours:</strong> Learn about the events of 1960 and their impact</li>
                  <li><strong>Educational visits:</strong> School and university groups can arrange educational programs</li>
                  <li><strong>Annual Human Rights Day commemorations:</strong> Participate in March 21st events</li>
                  <li><strong>Academic and research-focused tourism:</strong> Access to historical resources and documentation</li>
                </ul>
              </section>

              <section className="mb-12 bg-vaal-orange-50 p-6 rounded-lg">
                <h2 className="text-3xl font-bold mb-6">Community & Local Economy</h2>
                <p>Today, Sharpeville is a living community that continues to honor its history while building its future. The local economy includes:</p>
                <ul>
                  <li>Informal trading and local businesses</li>
                  <li>Community organizations and NGOs</li>
                  <li>Cultural initiatives and heritage programs</li>
                  <li>Local food vendors, especially during commemorative events</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Visiting Sharpeville</h2>
                <p>
                  When visiting Sharpeville, it's important to approach with respect and understanding of the site's significance. The Human Rights Precinct welcomes visitors year-round, with special programming during Human Rights Day in March.
                </p>
                <p>
                  Visitors are encouraged to take time to reflect on the events that took place here and their lasting impact on South Africa and the world.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Legacy and Importance</h2>
                <p>
                  Sharpeville's place in history extends far beyond its borders. The events of 21 March 1960 influenced:
                </p>
                <ul>
                  <li>International human rights movements</li>
                  <li>Global anti-apartheid activism</li>
                  <li>South Africa's eventual transition to democracy</li>
                  <li>The development of human rights law and policy worldwide</li>
                </ul>
                <p>
                  Today, Sharpeville serves as a reminder of the cost of freedom and the ongoing importance of protecting human rights for all people.
                </p>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg mb-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Important Information</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-gray-700">Location</dt>
                  <dd className="text-gray-600">Near Vereeniging, Sedibeng District Municipality</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Significance</dt>
                  <dd className="text-gray-600">Site of 1960 Sharpeville Massacre</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Annual Commemoration</dt>
                  <dd className="text-gray-600">March 21 - Human Rights Day</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Status</dt>
                  <dd className="text-gray-600">National Heritage Site</dd>
                </div>
              </dl>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-3">Learn More</h4>
                <div className="space-y-2">
                  <a href="/explore" className="block text-vaal-orange-600 hover:text-vaal-orange-700">
                    Vaal Triangle History →
                  </a>
                  <a href="/events" className="block text-vaal-orange-600 hover:text-vaal-orange-700">
                    Upcoming Events →
                  </a>
                  <a href="/towns/vereeniging" className="block text-vaal-orange-600 hover:text-vaal-orange-700">
                    Nearby Vereeniging →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-900 mb-2">Respectful Tourism</h4>
              <p className="text-sm text-blue-800">
                Sharpeville is a site of profound historical significance. Visitors are encouraged to approach with respect and take time to reflect on the events that took place here.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title={history.title}
      >
        <div className="prose prose-lg max-w-none">
          {history.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-bold mb-3">{section.heading}</h3>
              <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Sharpeville;
