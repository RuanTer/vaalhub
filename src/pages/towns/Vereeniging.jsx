import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { townHistories } from '../../data/townHistories';

const Vereeniging = () => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const history = townHistories.vereeniging;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200)',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-vaal-orange-400 font-medium mb-2">Town Guide</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Vereeniging</h1>
            <p className="text-xl text-gray-200">
              History, Things to Do, Businesses & Local Life
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Advertisement - Shows after hero on mobile only */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <p className="text-xs text-gray-400 text-center py-1 bg-gray-50">Advertisement</p>
          <div className="p-4">
            <img
              src="/ads/factorpro-logo.jpg"
              alt="FactorPro Industrial Solutions & Supplies"
              className="w-full h-auto"
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
                  Vereeniging is often described as the historical heart of the Vaal Triangle. Positioned along the banks of the Vaal River, it is one of the region's oldest towns and has played a central role in South Africa's industrial, political, and social development. Today, Vereeniging blends established suburbs, active commercial zones, cultural landmarks, and river-based leisure, making it both a working town and a lifestyle destination.
                </p>
                <p>
                  This guide provides a complete overview of Vereeniging — from its history and attractions to dining, business, and everyday living.
                </p>
              </section>

              {/* History */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">A Brief History of Vereeniging</h2>
                <p>
                  Founded in the late 1800s, Vereeniging developed rapidly due to its access to coal, water, and railway infrastructure. These factors made it a strategic industrial centre, particularly for iron and steel production.
                </p>
                <p>
                  The town's history is closely linked to South Africa's labour movement and political struggle. Nearby Sharpeville became globally known after the Sharpeville Massacre of 21 March 1960, a defining moment in the country's human rights history.
                </p>
                <p>
                  Today, Vereeniging remains a symbol of both industrial heritage and community resilience.
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
                <h2 className="text-3xl font-bold mb-6">Where Is Vereeniging?</h2>
                <p>
                  Vereeniging lies approximately 65 kilometres south of Johannesburg and forms part of the Sedibeng District Municipality in Gauteng. It borders Vanderbijlpark to the west and is connected to Meyerton via the R59.
                </p>
                <p>
                  Its location makes it accessible for commuters while still retaining a distinct local identity.
                </p>
              </section>

              {/* Things to Do */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Things to Do in Vereeniging</h2>

                <h3 className="text-2xl font-bold mb-4">River & Outdoor Activities</h3>
                <p>
                  The Vaal River is central to recreation in Vereeniging. Popular activities include:
                </p>
                <ul>
                  <li>Boating and river cruises</li>
                  <li>Fishing and angling competitions</li>
                  <li>Kayaking and paddle sports</li>
                  <li>Riverfront picnics and walking routes</li>
                </ul>
                <p>
                  Houseboat operators and resorts along the river attract visitors from across Gauteng, particularly over weekends.
                </p>

                <h3 className="text-2xl font-bold mb-4 mt-6">Entertainment & Attractions</h3>
                <ul>
                  <li><strong>Barnyard Theatre (Three Rivers):</strong> Dinner theatre offering live music, comedy, and family-friendly shows</li>
                  <li><strong>Emerald Resort & Casino:</strong> Waterpark, Animal World, golf course, and events venue</li>
                  <li><strong>Teknorama Museum:</strong> Local history and cultural exhibitions</li>
                </ul>

                <h3 className="text-2xl font-bold mb-4 mt-6">Family-Friendly Activities</h3>
                <ul>
                  <li>Play parks and open spaces in Three Rivers and surrounding suburbs</li>
                  <li>Bowling alleys and cinemas at nearby shopping centres</li>
                  <li>Family markets and seasonal events</li>
                </ul>
              </section>

              {/* Food & Restaurants */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Food & Restaurants in Vereeniging</h2>
                <p>
                  Vereeniging's dining scene is concentrated largely in the Three Rivers area, which is known for its variety of sit-down restaurants.
                </p>
                <p>Popular dining styles include:</p>
                <ul>
                  <li>Portuguese and grill-style restaurants</li>
                  <li>Italian and Mediterranean cuisine</li>
                  <li>Family-friendly pubs and casual dining</li>
                  <li>Coffee shops and bakeries</li>
                </ul>
                <p>
                  Riverfront restaurants offer relaxed dining with scenic views, particularly popular for lunch and sunset meals.
                </p>
              </section>

              {/* Shopping */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Shopping & Retail</h2>
                <ul>
                  <li><strong>River Square Mall:</strong> Central shopping destination with national retailers</li>
                  <li><strong>Checkers Hyper, Spars & local centres:</strong> Serving surrounding suburbs</li>
                  <li>Independent stores and service businesses throughout the CBD and residential areas</li>
                </ul>
              </section>

              {/* Local Business */}
              <section className="mb-12 bg-vaal-orange-50 p-6 rounded-lg">
                <h2 className="text-3xl font-bold mb-6">Local Businesses & Economy</h2>
                <p>
                  Vereeniging has a diverse business ecosystem. While manufacturing and heavy industry remain important, the town has seen growth in:
                </p>
                <ul>
                  <li>Small and medium-sized enterprises</li>
                  <li>Construction and trade services</li>
                  <li>Automotive services</li>
                  <li>Professional services</li>
                  <li>Hospitality and tourism</li>
                </ul>
                <p>Family-owned businesses play a significant role in the local economy.</p>
              </section>

              {/* Living */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Living in Vereeniging</h2>

                <h3 className="text-2xl font-bold mb-4">Residential Areas</h3>
                <p>Popular suburbs include:</p>
                <ul>
                  <li>Three Rivers</li>
                  <li>Risiville</li>
                  <li>Arcon Park</li>
                  <li>Roshnee</li>
                  <li>Duncanville</li>
                </ul>
                <p>
                  These areas offer a mix of freestanding homes, townhouses, and apartments, often at more affordable prices than Johannesburg.
                </p>

                <h3 className="text-2xl font-bold mb-4 mt-6">Schools & Education</h3>
                <p>
                  Vereeniging offers a wide selection of public and private schools, as well as access to tertiary institutions nearby, including the Vaal University of Technology.
                </p>

                <h3 className="text-2xl font-bold mb-4 mt-6">Transport & Accessibility</h3>
                <ul>
                  <li>Easy access via the R59 and N1 routes</li>
                  <li>Taxi and bus services operate throughout the town</li>
                  <li>Rail infrastructure still supports freight and limited passenger use</li>
                </ul>
              </section>

              {/* Conclusion */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Why Vereeniging Matters</h2>
                <p>
                  Vereeniging is more than a commuter town. It is a foundational part of the Vaal Triangle's identity — historically significant, economically active, and community-driven.
                </p>
                <p>
                  For residents, it offers affordability and access to nature. For visitors, it provides river activities, entertainment, and a glimpse into the region's rich past.
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
                  <dt className="font-semibold text-gray-700">Distance from Johannesburg</dt>
                  <dd className="text-gray-600">±65 km south</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Key Features</dt>
                  <dd className="text-gray-600">Vaal River, Industrial Heritage, Three Rivers Entertainment</dd>
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
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <p className="text-xs text-gray-400 text-center py-1 bg-gray-50">Advertisement</p>
              <div className="p-4">
                <img
                  src="/ads/factorpro-logo.jpg"
                  alt="FactorPro Industrial Solutions & Supplies"
                  className="w-full h-auto"
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

export default Vereeniging;
