import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/index.css";

function Index() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("a[href^='#']");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");

            navLinks.forEach((link) => {
              const sectionId = entry.target.getAttribute("id");
              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${sectionId}`
              );
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section, footer");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const yearElement = document.getElementById("year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }, []);

  return (
    <main className="page-wrapper">
      {/* NAVBAR */}
      <header className="top-navbar">
        <div className="nav-inner">
          <img src="img/logo1.png" alt="ServeShare Hero" width="140" />

          <nav className="desktop-nav">
            <a href="#home">Home</a>
            <a href="#donation">Donations</a>
            <a href="#about">About</a>
            <a href="#team">Team</a>
          </nav>

          <div
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setMenuOpen(!menuOpen);
            }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <a onClick={() => setMenuOpen(false)} href="#home">
            Home
          </a>
          <a onClick={() => setMenuOpen(false)} href="#donation">
            Donations
          </a>
          <a onClick={() => setMenuOpen(false)} href="#about">
            About
          </a>
          <a onClick={() => setMenuOpen(false)} href="#team">
            Team
          </a>
        </div>
      </header>

      {/* HOME */}
      <section className="home-sec" id="home">
        <div className="section-inner home-content">
          <div className="home-info fade-left">
            <h1>Alone we can do little, together we can do so much</h1>
            <h2>
              ServeShare connects <span>donors and NGOs</span> to support those in need.
            </h2>
            <p>
              From food and clothes to funds and stationery — ServeShare ensures donations
              reach verified NGOs and make real impact.
            </p>
            <button className="btn1" onClick={() => navigate("/login")}>
              Donate Now
            </button>
          </div>

          <div className="img-sec zoom-in">
            <img src="img/serveshare-hero.jpeg" alt="ServeShare Hero" />
          </div>
        </div>
      </section>
      <div className="rounded-divider"></div>

      {/* DONATION */}
      <div className="soft-shadow-divider"></div>
      <section className="don-sec" id="donation">
        <div className="container">
          <div className="heading text-center mb-5 fade-right">
            <h2>We Manage Donations</h2>
          </div>

          <div className="donation-row">
            <div className="don-box zoom-in">
              <img src="img/don/clothing.png" alt="Clothes" />
              <h3>Clothes & Footwear</h3>
              <p>Provide essential clothing and shoes to people in need.</p>
            </div>

            <div className="don-box zoom-in">
              <img src="img/don/book.png" alt="Books" />
              <h3>Books & Stationery</h3>
              <p>Support education by donating books and stationery.</p>
            </div>

            <div className="don-box zoom-in">
              <img src="img/don/salary.png" alt="Funds" />
              <h3>Funds</h3>
              <p>Support NGO operations and programs through financial aid.</p>
            </div>

            <div className="don-box zoom-in">
              <img src="img/don/shopping-bag.png" alt="Food" />
              <h3>Food</h3>
              <p>Help reduce food wastage by donating surplus food.</p>
            </div>
          </div>
        </div>
      </section>
      <div className="rounded-divider"></div>

      {/* ABOUT */}
      <div className="soft-shadow-divider"></div>
      <section className="about-sec" id="about">
        <div className="section-inner about-grid">
          <h2 className="about-heading">About Us</h2>

          <div className="about-img fade-left">
            <img src="img/img-2.jpeg" alt="About ServeShare" />
          </div>

          <div className="about-text fade-right">
            <h3>What We Do & Why It Matters</h3>

            <p>
              ServeShare connects donors with <span className="highlight">verified NGOs</span>,
              ensuring transparency and trust.
            </p>

            <p>
              We provide <span className="highlight">doorstep donation pickup</span> and
              responsible distribution.
            </p>

            <p>
              Our mission is to make giving <span className="highlight">easy</span>,
              <span className="highlight">meaningful</span>, and <span className="highlight">impactful</span>.
            </p>

            <button className="about-btn">Read More</button>
          </div>
        </div>
      </section>
      <div className="rounded-divider"></div>

      {/* TEAM */}
      <div className="soft-shadow-divider"></div>
      <section className="team-sec" id="team">
        <div className="section-inner">
          <h2 className="heading-left fade-left">Meet Our Team</h2>

          <div className="team-grid">
            <div className="team-card fade-up">
              <img src="img/Sujal.jpeg" alt="Sujal" />
              <h4>Sujal Dhopavkar</h4>
              <p>Founder & CEO</p>
              <div className="team-social">
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-brands fa-instagram"></i></a>
                <a href="#"><i className="fa-brands fa-github"></i></a>
              </div>
            </div>

            <div className="team-card fade-up">
              <img src="img/Bhumika.jpeg" alt="Bhumika" />
              <h4>Bhumika Chavan</h4>
              <p>Operations Head</p>
              <div className="team-social">
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-brands fa-instagram"></i></a>
                <a href="#"><i className="fa-brands fa-github"></i></a>
              </div>
            </div>

            <div className="team-card fade-up">
              <img src="img/Suyash.jpeg" alt="Suyash" />
              <h4>Suyash Gawade</h4>
              <p>Donor Relations</p>
              <div className="team-social">
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-brands fa-instagram"></i></a>
                <a href="#"><i className="fa-brands fa-github"></i></a>
              </div>
            </div>

            <div className="team-card fade-up">
              <img src="img/Shubham.jpeg" alt="Shubham" />
              <h4>Shubham Kene</h4>
              <p>Logistics Manager</p>
              <div className="team-social">
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-brands fa-instagram"></i></a>
                <a href="#"><i className="fa-brands fa-github"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="rounded-divider"></div>

      {/* FOOTER */}
      <footer className="footer fade-up">
        <div className="container row">
          <div className="col">
            <h4>ServeShare</h4>
            <p>M.G.M College Of Engineering, Kamothe, Panvel-402109</p>
            <p className="contact-highlight">
              Contact: <a href="tel:+91936219998">+91 93621****98</a>
            </p>

            <p className="contact-highlight">
              Email: <a href="mailto:serveshare@gmail.com">serveshare@gmail.com</a>
            </p>
          </div>

          <div className="col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#donation">Donations</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#team">Team</a></li>
            </ul>
          </div>

          <div className="col">
            <h4>Connect With Us</h4>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </div>
            <form className="newsletter" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Subscribe to newsletter" />
              <button className="btn1">Subscribe</button>
            </form>
          </div>
        </div>

        <hr />
        <p className="copyright">
          © <span id="year"></span> ServeShare | All Rights Reserved
        </p>
      </footer>
    </main>
  );
}

export default Index;
