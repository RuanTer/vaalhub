import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { townHistories } from '../../data/townHistories';

const Vanderbijlpark = () => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const history = townHistories.vanderbijlpark;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200)',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-vaal-orange-400 font-medium mb-2">Town Guide</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Vanderbijlpark</h1>
            <p className="text-xl text-gray-200">
              Industry, Lifestyle, Things to Do & Local Business
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
              {/* Introduction */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Introduction</h2>
                <p>
                  Vanderbijlpark is the planned industrial and residential centre of the Vaal Triangle. Designed in the mid-20th century as a modern town to support South Africa's growing steel industry, it is known for its wide roads, organised suburbs, strong educational institutions, and proximity to the Vaal River.
                </p>
                <p>
                  Today, Vanderbijlpark balances its industrial roots with retail growth, river-based leisure, and a steadily evolving lifestyle offering.
                </p>
              </section>

              {/* History */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">A Brief History of Vanderbijlpark</h2>
                <p>
                  Vanderbijlpark was established in the 1940s as a purpose-built town to support ISCOR (now ArcelorMittal South Africa). Unlike older towns that developed organically, Vanderbijlpark was carefully planned with residential zones, industrial areas, schools, and green spaces.
                </p>
                <p>
                  The town was named after Dr Hendrik van der Bijl, a key figure in South Africa's industrial development. Its layout reflects post-war urban planning principles focused on efficiency and livability.
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

              {/* Location */}
              <section className="mb-12 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-3xl font-bold mb-6">Where Is Vanderbijlpark?</h2>
                <p>
                  Vanderbijlpark lies west of Vereeniging along the Vaal River and forms part of the Sedibeng District Municipality in Gauteng. It is directly connected to Vereeniging and Sasolburg via major road networks and is easily accessible from Johannesburg via the R59 and N1.
                </p>
              </section>

              {/* Things to Do */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Things to Do in Vanderbijlpark</h2>

                <h3 className="text-2xl font-bold mb-4">River & Outdoor Lifestyle</h3>
                <p>The Vaal River plays a major role in recreation in Vanderbijlpark. Residents and visitors enjoy:</p>
                <ul>
                  <li>Riverfront walks and cycling</li>
                  <li>Boating and fishing</li>
                  <li>Riverside picnics and braais</li>
                  <li>Water sports and leisure cruises</li>
                </ul>
                <p>Several river estates and lodges are located just outside the town, offering weekend getaways close to home.</p>

                <h3 className="text-2xl font-bold mb-4 mt-6">Entertainment & Attractions</h3>
                <ul>
                  <li><strong>Riverside Sun Casino:</strong> Casino, hotel, spa, conference facilities, and live entertainment</li>
                  <li><strong>Vaal Mall:</strong> Largest shopping centre in the Vaal Triangle with retail, dining, and cinemas</li>
                  <li>Local sports clubs: Rugby, cricket, soccer, and athletics facilities</li>
                </ul>

                <h3 className="text-2xl font-bold mb-4 mt-6">Sports & Recreation</h3>
                <ul>
                  <li>Golf courses and driving ranges</li>
                  <li>Public swimming pools and gyms</li>
                  <li>Running and cycling routes</li>
                  <li>School and community sports leagues</li>
                </ul>
              </section>

              {/* Food & Restaurants */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Food, Drink & Social Spots</h2>
                <p>
                  Vanderbijlpark offers a mix of family restaurants, fast-casual dining, and coffee shops, particularly around the Vaal Mall and CBD areas.
                </p>
                <p>Dining options include:</p>
                <ul>
                  <li>Steakhouses and grills</li>
                  <li>Seafood restaurants</li>
                  <li>Coffee shops and bakeries</li>
                  <li>Casual pubs and takeaways</li>
                </ul>
                <p>River-adjacent venues and nearby estates provide more scenic dining options.</p>
              </section>

              {/* Shopping */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Shopping & Retail</h2>
                <ul>
                  <li><strong>Vaal Mall:</strong> Regional retail hub serving the entire Vaal Triangle</li>
                  <li>Neighbourhood shopping centres across suburbs</li>
                  <li>Independent retailers and service outlets in the CBD</li>
                </ul>
                <p>Retail plays a key role in employment and economic activity in the town.</p>
              </section>

              {/* Business & Industry */}
              <section className="mb-12 bg-vaal-orange-50 p-6 rounded-lg">
                <h2 className="text-3xl font-bold mb-6">Business & Industry</h2>
                <p>Industry remains central to Vanderbijlpark's identity. Key sectors include:</p>
                <ul>
                  <li>Steel production and manufacturing</li>
                  <li>Engineering and fabrication</li>
                  <li>Logistics and warehousing</li>
                  <li>Retail and service industries</li>
                </ul>
                <p>The town also supports a growing number of small businesses, contractors, and professional services.</p>
              </section>

              {/* Education */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Education & Institutions</h2>
                <p>Vanderbijlpark is home to major educational facilities, including:</p>
                <ul>
                  <li><strong>Vaal University of Technology (VUT):</strong> One of the region's largest tertiary institutions</li>
                  <li>Technical and vocational colleges</li>
                  <li>Public and private schools across suburbs</li>
                </ul>
                <p>These institutions play an important role in skills development and youth employment.</p>
              </section>

              {/* Living */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Living in Vanderbijlpark</h2>

                <h3 className="text-2xl font-bold mb-4">Residential Areas</h3>
                <p>Vanderbijlpark's suburbs are clearly defined and well organised, including:</p>
                <ul>
                  <li>SW1–SW5 areas</li>
                  <li>SE suburbs</li>
                  <li>CE areas</li>
                  <li>CW and NW extensions</li>
                </ul>
                <p>Housing options range from freestanding homes to townhouses and apartments.</p>

                <h3 className="text-2xl font-bold mb-4 mt-6">Transport & Accessibility</h3>
                <ul>
                  <li>Direct road links to Vereeniging and Sasolburg</li>
                  <li>Easy access to Johannesburg via major routes</li>
                  <li>Taxi and bus services operate throughout the town</li>
                </ul>
              </section>

              {/* Conclusion */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Why Vanderbijlpark Matters</h2>
                <p>
                  Vanderbijlpark represents the industrial backbone of the Vaal Triangle while continuing to evolve as a residential and commercial centre.
                </p>
                <p>
                  With strong infrastructure, educational institutions, and access to river-based recreation, it remains a key contributor to the region's economy and lifestyle.
                </p>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
            {/* Quick Facts */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Quick Facts</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-gray-700">Location</dt>
                  <dd className="text-gray-600">Sedibeng District Municipality, Gauteng</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Founded</dt>
                  <dd className="text-gray-600">1940s</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Key Features</dt>
                  <dd className="text-gray-600">Steel Industry, VUT, Vaal Mall, Riverside Sun Casino</dd>
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
                  <a href="/restaurants" className="block text-vaal-orange-600 hover:text-vaal-orange-700">
                    Places to Eat →
                  </a>
                </div>
              </div>
            </div>

            {/* Ad Space */}
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

export default Vanderbijlpark;
