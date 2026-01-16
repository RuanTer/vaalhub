import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { townHistories } from '../../data/townHistories';

const Meyerton = () => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const history = townHistories.meyerton;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1523459178261-028135da2714?w=1200)',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-vaal-orange-400 font-medium mb-2">Town Guide</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Meyerton</h1>
            <p className="text-xl text-gray-200">
              Small-Town Living, Nature & Growing Local Business
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
                <h2 className="text-3xl font-bold mb-6">Introduction</h2>
                <p>
                  Meyerton offers a quieter, more small-town alternative within the Vaal Triangle. Located south of Vereeniging, it is known for its relaxed pace of life, agricultural surroundings, and steadily growing residential developments. Over the years, Meyerton has become attractive to families, retirees, and entrepreneurs looking for space, affordability, and a strong sense of community.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">A Brief History of Meyerton</h2>
                <p>
                  Meyerton was established in the late 19th century and developed primarily as an agricultural service town. Its growth was supported by farming activity, railway connections, and its proximity to Vereeniging.
                </p>
                <p>
                  Unlike the heavily industrialised towns nearby, Meyerton retained a more rural character, which continues to influence its identity today.
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
                <h2 className="text-3xl font-bold mb-6">Where Is Meyerton?</h2>
                <p>
                  Meyerton is situated south of Vereeniging and forms part of the Midvaal Local Municipality, often regarded as one of the better-managed municipalities in Gauteng.
                </p>
                <p>
                  It is easily accessible via the R59, making it popular with commuters who work in Johannesburg, Vereeniging, or Vanderbijlpark.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Things to Do in Meyerton</h2>
                <h3 className="text-2xl font-bold mb-4">Outdoor & Nature Activities</h3>
                <p>Meyerton is surrounded by open land, smallholdings, and natural areas, offering:</p>
                <ul>
                  <li>Walking and cycling routes</li>
                  <li>Fishing spots along nearby river sections</li>
                  <li>Birdwatching and outdoor relaxation</li>
                  <li>Farm-style weekend outings</li>
                </ul>
                <p>The town's slower pace makes it ideal for outdoor living and family activities.</p>

                <h3 className="text-2xl font-bold mb-4 mt-6">Local Attractions</h3>
                <ul>
                  <li>Local markets and community events held at schools and community centres</li>
                  <li>Nearby nature reserves and lodges within short driving distance</li>
                  <li>Easy access to Suikerbosrand Nature Reserve</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Food, Coffee & Local Spots</h2>
                <p>Meyerton's food scene is smaller than Vereeniging or Vanderbijlpark but growing steadily.</p>
                <p>Local offerings include:</p>
                <ul>
                  <li>Family-run restaurants</li>
                  <li>Coffee shops and bakeries</li>
                  <li>Takeaway and casual dining options</li>
                  <li>Farm-style eateries on surrounding plots</li>
                </ul>
                <p>Many residents support local businesses, contributing to a strong community economy.</p>
              </section>

              <section className="mb-12 bg-vaal-orange-50 p-6 rounded-lg">
                <h2 className="text-3xl font-bold mb-6">Business & Economic Activity</h2>
                <p>Meyerton's economy is driven largely by:</p>
                <ul>
                  <li>Small and medium-sized businesses</li>
                  <li>Trades and services</li>
                  <li>Agricultural suppliers</li>
                  <li>Home-based and informal businesses</li>
                </ul>
                <p>In recent years, new residential developments and estates have brought increased demand for services, retail, and professional businesses.</p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Living in Meyerton</h2>
                <h3 className="text-2xl font-bold mb-4">Residential Areas</h3>
                <p>Meyerton offers a mix of:</p>
                <ul>
                  <li>Traditional suburban neighbourhoods</li>
                  <li>Smallholdings and agricultural plots</li>
                  <li>New residential estates</li>
                </ul>
                <p>Property prices are generally more affordable than nearby urban centres, making the town attractive for long-term settlement.</p>

                <h3 className="text-2xl font-bold mb-4 mt-6">Schools & Education</h3>
                <p>Meyerton is home to several well-regarded primary and secondary schools, with additional options available in nearby towns.</p>

                <h3 className="text-2xl font-bold mb-4 mt-6">Transport & Accessibility</h3>
                <ul>
                  <li>Direct access to the R59</li>
                  <li>Taxi and bus services</li>
                  <li>Private vehicle remains the primary mode of transport</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Why Meyerton Matters</h2>
                <p>
                  Meyerton plays an important balancing role in the Vaal Triangle. It offers space, affordability, and a slower lifestyle while remaining closely connected to larger economic hubs.
                </p>
                <p>
                  For many residents, Meyerton represents the best of both worlds — rural calm with urban convenience nearby.
                </p>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg mb-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Quick Facts</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-gray-700">Location</dt>
                  <dd className="text-gray-600">Midvaal Local Municipality, Gauteng</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Character</dt>
                  <dd className="text-gray-600">Agricultural, Small-town, Family-friendly</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Key Features</dt>
                  <dd className="text-gray-600">Smallholdings, Nature, Affordability</dd>
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
                  <a href="/living" className="block text-vaal-orange-600 hover:text-vaal-orange-700">
                    Living Here →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-2">Advertisement</p>
              <div className="bg-white h-64 flex items-center justify-center rounded">
                <p className="text-gray-400">Ad Space 300x250</p>
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

export default Meyerton;
