import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import HighlightText from "../components/core/HomePage/HighlightText";
import Button from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ReviewSlider from "../components/common/ReviewSlider";
import Footer from "../components/common/Footer";
import ExploreMore from "../components/core/HomePage/ExploreMore";

const Home = () => {
  return (
    <div>
      {/* { section 1 } */}
      <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between">
        {/* Become a Instructor Button */}
        <Link to={"/signup"}>
          <div
            className=" group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
             transition-all duration-200 hover:scale-95 w-full"
          >
            <div className=" flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
        {/* Empower Heading */}
        <div className="text-center text-4xl font-semibold mt-7">
          Empower Your Future With
          <HighlightText text={"Coding Skills"} />
        </div>

        {/* Sub Heading */}
        <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-row gap-7 mt-8 font-bold">
          <Button active={true} linkto={"/signup"}>
            Learn More
          </Button>
          <Button active={false} linkto={"/login"}>
            Book a demo
          </Button>
        </div>

        {/* Video */}
        <div className=" shadow-blue-100 mt-16 mx-9 my-10 shadow-[10px_-5px_50px_-5px] ">
          <video className="" muted loop autoPlay src={Banner}></video>
        </div>

        {/* Code Section 1  */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock Your
                <HighlightText text={"Coding Potential "} />
                <br></br>
                With Our Online Courses...
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson. Full stack development is good tech stack for earning good money..."
            }
            ctabtn1={{
              btnText: "Try it yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn more",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta name="viewport">\n<title>Two Heading Tags</title>\n</head>\n<body>\n<h1>This is Heading 1</h1>\n<h2>This is Heading 2</h2>\n</body>\n</html>`}
            backgroundGradient={
              <div className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-orange-800 p-6"></div>
            }
            codeColor={"text-white font-inter"}
          />
        </div>

        {/* Code Section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-4xl font-semibold lg:w-[50%]">
                Start
                <HighlightText text={"Coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson. Full stack development is good tech stack for earning good money..."
            }
            ctabtn1={{
              btnText: "Continue lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn more",
              linkto: "/login",
              active: false,
            }}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={
              <div className=" bg-gradient-to-r from-yellow-200 via-yellow-300 to-orange-500 p-6"></div>
            }
            codeColor={"text-white"}
          />
        </div>

        <ExploreMore />
      </div>

      {/* { section 2 } */}

      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[290px]">
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className=" flex flex-row gap-7 text-white lg:mt-44">
              <Button active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </Button>
              <Button active={false} linkto={"/about"}>
                <div>About Us</div>
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7">
          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%]">
              Get the Skills you need for a{" "}
              <HighlightText text={"Job that is in demand..."} />
            </div>

            <div className="flex flex-col gap-10 lg:w-[40%] items-start">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <Button active={true} linkto={"/contact"}>
                <div>Contact Us</div>
              </Button>
            </div>
          </div>

          <TimelineSection />
          <LearningLanguageSection />

        </div>
      </div>

      {/* { section 3 } */}

      <div className="relative mx-auto my-20 max-w-maxContent w-11/12 flex-col items-center justify-between gap-8 bg-richblack-900 text-white">

            <InstructorSection />

            <h2 className='text-center text-4xl font-semibold mt-14'>Reviews from Other Learners</h2>
            <div className='flex flex-col justify-between'>
            {/* <ReviewSlider/> */}
            </div>
            
      </div>


      {/* { Footer } */}
      <Footer />


    </div>
  );
};


export default Home;