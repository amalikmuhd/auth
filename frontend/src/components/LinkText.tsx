import { Link } from "react-router-dom";

type Link = {
  path: string;
  title: string;
};

const LinkText = ({ path, title }: Link) => {
  return (
    <Link to={path} className={'text-black hover:underline"'}>
      {title}
    </Link>
  );
};

export default LinkText;
