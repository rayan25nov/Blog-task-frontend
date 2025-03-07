import { Link } from "react-router-dom";

interface BlogCardProps {
  title: string;
  description: string;
  imageUrl: string;
  blogId?: string;
}

const truncate = (str: string): string => {
  const limit = 400;
  if (str.length > limit) {
    return str.slice(0, limit) + "...";
  }
  return str;
};

const Card: React.FC<BlogCardProps> = (props) => {
  const { title, description, imageUrl, blogId } = props;
  return (
    <div className="p-4">
      {blogId && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Link to={`/specific-blog/${blogId}`}>
            <img
              src={imageUrl}
              alt="Blog Image"
              className="w-full h-48 object-cover"
            />
            <h2 className="text-xl font-bold p-2">{title}</h2>
            <p className="text-gray-700 p-2">{truncate(description)}</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Card;
