import about1 from "../assets/about1.jpg";
import about2 from "../assets/about2.jpg";

export default function AboutPage() {
    return (
        <main className="px-15 py-12">
            <div className="main-content flex flex-row items-top gap-5 justify-center pb-12">
                <div className="">
                    <div className="mb-6 flex-1 flex-grow">
                        <h1 className="mb-6 text-5xl font-bold">About Us</h1>
                        <p>
                            Founded in 2010, Gerakan Pengguna Siswa Universiti Teknologi Malaysia (GPS UTM) was established under the Student Affairs Office (HEP) with the aim of nurturing a community of smart, ethical, and informed student consumers. From its early days as a small awareness group, GPS UTM has grown into an active organization that empowers students through education, collaboration, and advocacy. Guided by the mission to promote responsible consumerism and sustainability on campus, GPS UTM continues to organize programs, workshops, and campaigns that inspire UTM students to make thoughtful and impactful choices in their daily lives.
                        </p>
                    </div>
                    <div className="pictures-section flex flex-row gap-8">
                        <img src={about1} alt="About Image 1" className="w-1/2 rounded-lg shadow-lg" />
                        <img src={about2} alt="About Image 2" className="w-1/2 rounded-lg shadow-lg" />
                    </div>
                </div>
            </div>
            
        </main>
    );
}