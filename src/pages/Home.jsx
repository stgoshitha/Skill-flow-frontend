import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {

  return (
    <div>
      <Header/>
      <h2>Welcome to the OAuth Demo</h2>
      <div className="flex flex-col gap-4 bg-red-300 justify-center items-center p-4 rounded">

      </div>
      <Footer/>
    </div>
  );
};

export default Home;
