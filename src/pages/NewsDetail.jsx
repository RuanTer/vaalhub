import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/news/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Article not found');
        }
        throw new Error('Failed to fetch article');
      }

      const data = await response.json();
      setArticle(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shareArticle = (platform) => {
    const url = window.location.href;
    const title = article?.headline || 'VaalHub News';

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-vaal-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            to="/news"
            className="inline-block bg-vaal-orange-500 text-white px-6 py-3 rounded-lg hover:bg-vaal-orange-600 transition-colors"
          >
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Featured Image */}
          {article.image_url && (
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <img
                src={article.image_url}
                alt={article.headline}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Category & Area */}
            <div className="flex flex-wrap gap-2 mb-4">
              {article.category && (
                <span className="inline-block px-3 py-1 bg-vaal-orange-100 text-vaal-orange-700 text-sm font-medium rounded-full">
                  {article.category}
                </span>
              )}
              {article.area && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                  {article.area}
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.headline}
            </h1>

            {/* Date */}
            <p className="text-gray-500 mb-6">{formatDate(article.publish_date)}</p>

            {/* Full Text */}
            {article.full_text && (
              <div className="prose prose-lg max-w-none mb-8">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {article.full_text}
                </div>
              </div>
            )}

            {/* Source Attribution (Copyright Compliance) */}
            {article.source_url && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Source:</strong> Content aggregated from external sources.
                  {article.source_name && ` Original reporting by ${article.source_name}.`}
                </p>
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read original article
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Share Section */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Share this article</h3>
              <div className="flex gap-2">
                {/* Facebook */}
                <button
                  onClick={() => shareArticle('facebook')}
                  className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>

                {/* X / Twitter */}
                <button
                  onClick={() => shareArticle('twitter')}
                  className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  aria-label="Share on X / Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => shareArticle('whatsapp')}
                  className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  aria-label="Share on WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Back to News Link */}
            <div className="mt-8">
              <Link
                to="/news"
                className="inline-flex items-center text-vaal-orange-600 hover:text-vaal-orange-700 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to all news
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
