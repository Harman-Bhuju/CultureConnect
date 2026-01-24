import React, { useEffect } from "react";
import { Code2, Mail } from "lucide-react";
import Navbar from "../../components/Layout/NavBar";
import Footer from "../../components/Layout/Footer";
import TeamMemberCard from "./TeamMemberCard";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import AppSidebar from "../../components/Layout/app-sidebar";

// Image imports
import HarshitImg from "../../assets/team/harshit_portrait.png";
import HarmanImg from "../../assets/team/harman_portrait.png";

const OurTeam = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar />

          <main className="flex-1">
            {/* Hero Section */}
            <section className="py-16 lg:py-24 px-6 bg-gray-50">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <span className="inline-block px-4 py-2 bg-royal-blue text-white rounded-full text-sm font-bold tracking-wider uppercase">
                  The Builders
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                  Meet the Minds Behind{" "}
                  <span className="text-heritage-red">CultureConnect</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  We're a dynamic duo of brothers passionate about building
                  seamless digital experiences. Together, we combine
                  cutting-edge frontend design with powerful backend
                  functionality to create websites that don't just look
                  good—they work flawlessly.
                </p>
              </div>
            </section>

            {/* Team Members Section */}
            <section className="py-16 lg:py-20 px-6">
              <div className="max-w-6xl mx-auto space-y-16 lg:space-y-24">
                <TeamMemberCard
                  name="Harshit Bhuju"
                  role="Frontend Developer & UI Architect"
                  description="The creative force behind what users see. Transforms ideas into stunning, interactive interfaces with a focus on usability and modern design aesthetics."
                  techStack={[
                    "React",
                    "JavaScript",
                    "Tailwind CSS",
                    "C",
                    "Bootstrap",
                    "HTML5",
                    "CSS3",
                  ]}
                  projectRole="Crafted the entire frontend experience using React with Tailwind, ensuring a smooth, responsive, and visually captivating user interface."
                  image={HarshitImg}
                  email="harshitbhuju123@gmail.com"
                  isReverse={false}
                />

                <div className="border-t border-gray-100"></div>

                <TeamMemberCard
                  name="Harman Bhuju"
                  role="Backend Developer & Database Engineer"
                  description="The powerhouse behind the scenes. Builds robust infrastructure, manages server logic, and secures data to ensure performance and reliability."
                  techStack={[
                    "PHP",
                    "SQL",
                    "JavaScript",
                    "HTML5",
                    "CSS3",
                    "Bootstrap",
                    "C",
                  ]}
                  projectRole="Developed the backend architecture with PHP and SQL, creating a solid foundation for data management and server-side functionality."
                  image={HarmanImg}
                  email="harmanbhuju@gmail.com"
                  isReverse={true}
                />
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-20 px-6 bg-gray-50">
              <div className="max-w-4xl mx-auto bg-charcoal rounded-2xl p-8 lg:p-12 text-center text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-10">
                  <Code2 size={100} />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 relative z-10">
                  Want to work with us?
                </h2>
                <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto relative z-10">
                  Whether you have a question or a project proposal, we're
                  always open to connecting with fellow digital enthusiasts.
                </p>
                <button
                  onClick={() =>
                    (window.location.href =
                      "https://mail.google.com/mail/?view=cm&fs=1&to=cultureconnect0701@gmail.com")
                  }
                  className="px-8 py-4 bg-heritage-red text-white rounded-xl font-bold hover:bg-heritage-red/90 transition-all duration-200 flex items-center gap-2 mx-auto active:scale-95 shadow-lg relative z-10">
                  <Mail className="w-5 h-5" />
                  Contact the Duo
                </button>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default OurTeam;
