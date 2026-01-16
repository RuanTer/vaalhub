import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      {article.image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        {article.category && (
          <span className="inline-block px-3 py-1 text-xs font-semibold text-vaal-orange-600 bg-vaal-orange-50 rounded-full mb-3">
            {article.category}
          </span>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-vaal-orange-600 transition-colors">
          <Link to={article.slug}>{article.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{article.date}</span>
          <Link
            to={article.slug}
            className="text-vaal-orange-500 hover:text-vaal-orange-600 font-medium flex items-center"
          >
            Read More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
