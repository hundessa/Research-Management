import { FaSearch } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <>
      <div className="shado bg-white fixed w-full z-[10001]">
        <div className="h-16 mx-auto px-5 flex items-center justify-between">
          {/* <a className="text-2xl hover:text-cyan-500 transition-colors cursor-pointer">Logo</a> */}
          <div className="flex items-center justify-center h-20 shadowmd">
            <h1 className="text-3xl uppercase text-indigo-500">Logo</h1>
          </div>

          <ul className="flex items-center gap-8 text-xl">
            <div className="relative text-gray-600">
              <input
                type="search"
                name="serch"
                placeholder="Search"
                className="bg-white h-10 px-5 pr-10 border-3 border-gray-100 rounded-full text-sm focus:outline-none"
              />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-3 mr-4 cursor-pointer"
                >
                  <FaSearch className="h-4 w-4" />
                </button>
            </div>
            <li className="dropdown ml-3">
              <button
                type="button"
                className="dropdown-toggle flex items-center"
              >
                <div className="flex-shrink-0 w-10 h-10 relative">
                  <div className="p-1 bg-white rounded-full focus:outline-none focus:ring">
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://laravelui.spruko.com/tailwind/ynex/build/assets/images/faces/9.jpg"
                      alt=""
                    />
                    {/* <div className="top-0 left-7 absolute w-3 h-3 bg-lime-400 border-2 border-white rounded-full animate-ping"></div>
                    <div className="top-0 left-7 absolute w-3 h-3 bg-lime-500 border-2 border-white rounded-full"></div> */}
                  </div>
                </div>
                <div className="p-2 md:block text-left">
                  <h2 className="text-sm font-semibold text-gray-800">
                    John Doe
                  </h2>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
