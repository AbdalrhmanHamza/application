"use client";

import { use, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { generateToken } from "../../firebase_config";
import { getMessaging, onMessage } from "firebase/messaging";
import { initializeFirebase } from "../../firebase_config";
import { toast } from "sonner";

export default function Home() {
  const { user } = use(AuthContext);
  const { firebase } = initializeFirebase();

  useEffect(() => {
    if (user) {
      const messaging = getMessaging(firebase);
      generateToken();
      onMessage(messaging, (payload) => {
        // show toast notification
        toast(payload.notification.title, {
          description: payload.notification.body,
          action: {
            label: "Close",
          },
        });
      });
    }
  }, [user]);

  return (
    <main className="main w-full">
      {/* <!-- main section --> */}
      <section className="main-section container-padding" id="main">
        <div className="main-content-wrapper">
          <div className="main-content-text">
            <div className="text-content">
              <h1 className="main-heading">
                تواصل، دردش،
                <br />
                وكوّن صداقات على
                <span className="underline-css">
                  <span className="text-over">غلا لايف</span>
                  <img src="/llline.svg" alt="" className="text-underline" />
                </span>
              </h1>
              <p className="description">
                يجمع تطبيق <span className="text-highlight">غلا لايف</span>{" "}
                أشخاصًا من جميع أنحاء العالم، ويتيح لك مشاركة اللحظات، والدردشة
                مع العائلة والأصدقاء، وبناء علاقات جديدة بكل سهولة. أرسل رسائل،
                وشارك آخر المستجدات، واستمتع بالدردشة بطريقة ممتعة وجذابة!
              </p>
            </div>
            <div className="download-buttons">
              <div className="app-store">
                <a href="" className="apple-coming-soon">
                  <img
                    className="google-play-img store-btn"
                    src="/App-store.svg"
                    alt="Apple App Store Download"
                  />
                </a>
              </div>
              <div className="google-play">
                <a
                  href="https://play.google.com/store/apps/details?id=com.galalive.chat"
                  target="_blank"
                >
                  <img
                    className="google-play-img store-btn"
                    src="/google-play.png"
                    alt="Google Play Store"
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="main-content-img">
            <img
              src="/main-portrait-min.png"
              className="main-img"
              draggable="false"
              alt="Gala live App Screenshot"
            />
          </div>
        </div>
      </section>
      {/* <!-- about us section --> */}
      <section className="about-us-section container-padding" id="about-us">
        <div className="main-content-wrapper">
          <div className="about-sec-container">
            <div className="about-heading-container">
              <h1 className="about-heading">عن التطبيق</h1>
              <p className="about-description">
                في <span className="text-highlight"> غلا لايف</span>، نؤمن بقوة
                المجتمع والإبداع.
              </p>
            </div>
            {/* <!-- content --> */}
            <div className="about-content">
              <div className="about-content-description-container">
                <h1 className="about-content-heading">
                  ابق على اتصال مع
                  <span className="underline-css">
                    <span className="text-over">أصدقائك</span>
                    <img
                      src="/llline-2.svg"
                      alt=""
                      className="text-underline less-top"
                    />
                  </span>
                </h1>
                <p className="about-content-desc">
                  <span className="text-highlight">غلا لايف</span> مصمم لتقريب
                  الناس من بعضهم البعض. سواء كنت تتواصل مع عائلتك أو تقابل
                  أشخاصًا جددًا، يوفر تطبيقنا طريقة سلسة للبقاء على اتصال عبر
                  الدردشة المباشرة والرسائل النصية والصوتية.
                </p>
                <a
                  href="https://play.google.com/store/apps/details?id=com.galalive.chat"
                  target="_blank"
                  className="btn-primary-download"
                >
                  حمله الان
                  <img
                    src="/arrow-down-to-line.svg"
                    alt="Google Play Store"
                    className="download-icon"
                  />
                </a>
              </div>
              <div className="about-content-visual-container">
                <div className="about-visual-container">
                  <img
                    src="/profile-left.png"
                    className="about-visual-img"
                    alt="Gala live App Visual"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- features section --> */}
      <section className="features-section container-padding" id="features">
        <div className="main-content-wrapper">
          <div className="about-sec-container">
            {/* <!-- features content --> */}
            <div className="features-text-content">
              <h1 className="features-heading">الميزات</h1>
              <p className="features-description">
                اكتشف الميزات المذهلة لتطبيق
                <span className="text-highlight">غلا لايف</span> التي تجعله
                الخيار الأفضل للبقاء على اتصال.
              </p>
            </div>
            {/* <!-- features --> */}
            <div className="features-grid-container">
              <div className="features-grid">
                <div className="feature-box-container instant-messaging featue-bg">
                  <div className="feature-box">
                    <h3 className="feature-heading">الرسائل الفورية</h3>
                    <p className="feature-description">
                      تواصل مع أصدقائك في الوقت الفعلي باستخدام ميزة المراسلة
                      الفورية لدينا.
                    </p>
                  </div>
                </div>
                <div className="feature-box-container global-connection featue-bg">
                  <div className="feature-box">
                    <h3 className="feature-heading">اتصالات دولية</h3>
                    <p className="feature-description">
                      تواصل مع أصدقائك من جميع أنحاء العالم باستخدام ميزة
                      الاتصالات العالمية لدينا.
                    </p>
                  </div>
                </div>
                <div className="feature-box-container security featue-bg">
                  <div className="feature-box">
                    <h3 className="feature-heading">الأمان والخصوصية</h3>
                    <p className="feature-description">
                      خصوصيتك هي أولويتنا. استمتع بمراسلة آمنة مع تشفير شامل.
                    </p>
                  </div>
                </div>
                <div className="feature-box-container multimedia featue-bg">
                  <div className="feature-box">
                    <h3 className="feature-heading">مشاركة الوسائط المتعددة</h3>
                    <p className="feature-description">
                      شارك الصور ومقاطع الفيديو والرسائل الصوتية بسلاسة مع ميزة
                      مشاركة الوسائط المتعددة لدينا.
                    </p>
                  </div>
                </div>
                <div className="feature-box-container users-chat featue-bg">
                  <div className="feature-box">
                    <h3 className="feature-heading">دردشة المستخدمين</h3>
                    <p className="feature-description">
                      تواصل مع أصدقائك وعائلتك من خلال ميزة الدردشة الخاصة
                      بالمستخدمين.
                    </p>
                  </div>
                </div>
                <div className="feature-box-container fun-interactive featue-bg">
                  <div className="feature-box">
                    <h3 className="feature-heading">ممتع وتفاعلي</h3>
                    <p className="feature-description">
                      استمتع بمجموعة متنوعة من الميزات الممتعة والتفاعلية لتعزيز
                      تجربة الدردشة الخاصة بك.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="download-section container-padding"
        id="download"
      ></section>
      <div className="overlay"></div>
      {/* modal */}
      <div className="coming-soon-modal">
        <div className="modal-overlay"></div>
        <button className="close-modal-btn flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x-icon lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <div className="modal-content-container">
          <div className="modal-content">
            <h1 className="modal-heading">خطوات التحميل</h1>
            <ol>
              <li>
                قم بتحميل تطبيق <strong>Test Flight</strong>
                <a
                  href="https://apps.apple.com/us/app/testflight/id899247664"
                  className="instruction-link link-highlight"
                  target="_blank"
                >
                  اضغط هنا للتحميل
                </a>
              </li>
              <li>
                بعد تحميل التطبيق
                <a
                  href="https://testflight.apple.com/join/4mcF8ADS"
                  className="instruction-link link-highlight"
                  target="_blank"
                >
                  اضغط هنا
                </a>
                لتحميل تطبيق <strong>Gala Live</strong> لل ios
              </li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
