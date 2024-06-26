import React, { useEffect, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropdown";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";


const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const [loading, setLoading] = useState(false)

  const location = useLocation();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const subLinks = [
    {
      title: "Python",
      url: "/catalog/python"
    },
    {
      title: "Python",
      url: "/catalog/python"
    }
  ]

  // api call
  // const [subLinks, setSubLinks ] = useState([]);

  // const fetchSubLinks = async() => {
  //   try {
  //       const result = await apiConnector('GET', categories.CATEGORIES_API );
  //       console.log("Result of category list: ", result)
  //       setSubLinks(result.data.data)
  //   } catch (error) {
  //     console.log(`Could not fetch the category list : ${error}`)
  //   }
  // }

  // useEffect(() => {
  //   fetchSubLinks();
  // }, [])







  return (
    <div className=" flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
      <div className=" flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Image logo */}
        <Link to="/">
          <img src={logo} width={160} height={32} loading="lazy" />
        </Link>

        {/* Nav links */}
        <nav>
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((url, index) => (
              <li key={index}>
                {url.title === "Catalog" ? (
                <>
                <div
                  className={`group relative flex cursor-pointer items-center gap-1 ${
                    matchRoute("/catalog/:catalogName")
                      ? "text-yellow-25"
                      : "text-richblack-25"
                  }`}
                > 
                  <p>{url.title}</p>
                  <BsChevronDown />
                  <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={subLink.url}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.title}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={url?.path}>
                    <p
                      className={`${
                        matchRoute(url.path) ? "text-yellow-25" : " text-white"
                      }`}
                    >
                      {url.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accounType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] font-bold border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] font-bold border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
