import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { townHistories } from '../../data/townHistories';

const Sasolburg = () => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const history = townHistories.sasolburg;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200)',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-vaal-orange-400 font-medium mb-2">Town Guide</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sasolburg</h1>
            <p className="text-xl text-gray-200">
              Industrial Strength & Riverfront Leisure
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Advertisement - Shows after hero on mobile only */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-md mx-auto">
          <p className="text-xs text-gray-400 text-center py-1 bg-gray-50">Advertisement</p>
          <div className="p-3">
            <img
              src="/ads/factorpro-logo.jpg"
              alt="FactorPro Industrial Solutions & Supplies"
              className="w-full h-auto max-h-32 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            <div className="article-content prose prose-lg max-w-none">
              <section className="mb-12 bg-gray-50 p-6 rounded-lg border-l-4 border-vaal-orange-500">
                <h2 className="text-3xl font-bold mb-6">Overview</h2>
                <p>
                  Sasolburg is a planned industrial town developed around the Sasol chemical plants. Although located in the Free State, it is economically and socially integrated into the Vaal Triangle.
                </p>
              </section>

              <section className="mb-12 bg-gray-50 p-6 rounded-lg border-l-4 border-vaal-orange-500">
                <h2 className="text-3xl font-bold mb-6">Historical Background</h2>
                <p>
                  Established in the 1950s, Sasolburg was built to support the country's synthetic fuel and chemical industries. Its planning prioritised infrastructure, residential comfort, and business efficiency.
                </p>
                <p>
                  The town's development was closely tied to the establishment of Sasol (South African Synthetic Oil Limited), which pioneered the production of synthetic fuels and chemicals from coal.
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

              <section className="mb-12 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-3xl font-bold mb-6">Location</h2>
                <p>
                  While technically in the Free State province, Sasolburg forms an integral part of the Vaal Triangle economic region. It is connected to Vanderbijlpark and Vereeniging via major road networks along the Vaal River.
                </p>
              </section>

              <section className="mb-12 bg-gray-50 p-6 rounded-lg border-l-4 border-vaal-orange-500">
                <h2 className="text-3xl font-bold mb-6">Things to Do in Sasolburg</h2>
                <h3 className="text-2xl font-bold mb-4">Riverfront Leisure</h3>
                <p>The Vaal River provides numerous recreational opportunities:</p>
                <ul>
                  <li>Riverfront leisure and boating activities</li>
                  <li>Fishing and water sports</li>
                  <li>Scenic river walks and picnic spots</li>
                  <li>Nature-based relaxation along the Vaal River</li>
                </ul>

                <h3 className="text-2xl font-bold mb-4 mt-6">Sports & Recreation</h3>
                <ul>
                  <li>Golf courses and sports clubs</li>
                  <li>Community sports facilities</li>
                  <li>Fitness centers and recreational areas</li>
                </ul>

                <h3 className="text-2xl font-bold mb-4 mt-6">Conferences & Corporate Travel</h3>
                <p>
                  Sasolburg's corporate presence makes it a destination for:
                </p>
                <ul>
                  <li>Business conferences and meetings</li>
                  <li>Corporate training and events</li>
                  <li>Industrial tours and educational visits</li>
                </ul>
              </section>

              <section className="mb-12 bg-gray-50 p-6 rounded-lg border-l-4 border-vaal-orange-500">
                <h2 className="text-3xl font-bold mb-6">Restaurants & Dining</h2>
                <p>Sasolburg offers a range of dining options:</p>
                <ul>
                  <li>River-facing restaurants with scenic views</li>
                  <li>Hotel dining venues</li>
                  <li>Family grills and cafés</li>
                  <li>Independent eateries serving residents and business travellers</li>
                </ul>
              </section>

              <section className="mb-12 bg-vaal-orange-50 p-6 rounded-lg">
                <h2 className="text-3xl font-bold mb-6">Local Businesses & Economy</h2>
                <p>Sasolburg's economy is built around several key sectors:</p>
                <ul>
                  <li><strong>Chemical and engineering services:</strong> Supporting the petrochemical industry</li>
                  <li><strong>Logistics and transport:</strong> Moving goods and materials</li>
                  <li><strong>Safety and industrial supply:</strong> Providing equipment and services to industry</li>
                  <li><strong>Environmental and training services:</strong> Supporting sustainable practices and skills development</li>
                </ul>
              </section>

              <section className="mb-12 bg-gray-50 p-6 rounded-lg border-l-4 border-vaal-orange-500">
                <h2 className="text-3xl font-bold mb-6">Living in Sasolburg</h2>
                <p>Residents of Sasolburg benefit from:</p>
                <ul>
                  <li><strong>Well-planned suburbs:</strong> Organized residential areas with good infrastructure</li>
                  <li><strong>Strong infrastructure:</strong> Reliable services and amenities</li>
                  <li><strong>Corporate housing options:</strong> Accommodation for industry employees</li>
                  <li><strong>Proximity to Vanderbijlpark and Vereeniging:</strong> Easy access to additional services and amenities</li>
                </ul>

                <h3 className="text-2xl font-bold mb-4 mt-6">Transport & Accessibility</h3>
                <ul>
                  <li>Direct road connections to the Vaal Triangle towns</li>
                  <li>Easy access to the N1 highway</li>
                  <li>Well-maintained internal road network</li>
                </ul>
              </section>

              <section className="mb-12 bg-gray-50 p-6 rounded-lg border-l-4 border-vaal-orange-500">
                <h2 className="text-3xl font-bold mb-6">Why Sasolburg Matters</h2>
                <p>
                  Sasolburg represents a significant part of South Africa's industrial heritage and economic strength. As a planned industrial town, it demonstrates the relationship between industry, community, and regional development.
                </p>
                <p>
                  Its integration with the Vaal Triangle makes it an essential part of the region's economic ecosystem, contributing to employment, innovation, and community life across municipal boundaries.
                </p>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Quick Facts</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-gray-700">Location</dt>
                  <dd className="text-gray-600">Free State (Vaal Triangle region)</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Founded</dt>
                  <dd className="text-gray-600">1950s</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Key Features</dt>
                  <dd className="text-gray-600">Sasol Petrochemicals, Vaal River, Planned Town</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Industry</dt>
                  <dd className="text-gray-600">Petrochemicals, Manufacturing, Engineering</dd>
                </div>
              </dl>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-3">Explore More</h4>
                <div className="space-y-2">
                  <a href="/business" className="block text-vaal-orange-600 hover:text-vaal-orange-700">
                    Local Businesses →
                  </a>
                  <a href="/events" className="block text-vaal-orange-600 hover:text-vaal-orange-700">
                    Upcoming Events →
                  </a>
                  <a href="/towns/vanderbijlpark" className="block text-vaal-orange-600 hover:text-vaal-orange-700">
                    Nearby Vanderbijlpark →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-md mx-auto">
              <p className="text-xs text-gray-400 text-center py-1 bg-gray-50">Advertisement</p>
              <div className="p-3">
                <img
                  src="/ads/factorpro-logo.jpg"
                  alt="FactorPro Industrial Solutions & Supplies"
                  className="w-full h-auto max-h-32 object-contain"
                />
              </div>
            </div>
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

export default Sasolburg;
