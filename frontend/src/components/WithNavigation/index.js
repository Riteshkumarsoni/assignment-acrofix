import { useNavigate, useParams} from 'react-router-dom';

export function withNavigation(Component) {
  return function(props) {
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} params={params} navigate={navigate} />;
  };
}
