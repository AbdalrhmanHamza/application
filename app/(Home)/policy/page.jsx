"use client";

import { useReducer } from "react";

function scrollInView(item, active = false) {
  if (!active) {
    item.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_ACCORDION_1":
      scrollInView(action.item, state.accordion1Open);
      return {
        ...state,
        accordion1Open: !state.accordion1Open,
      };
    case "TOGGLE_ACCORDION_2":
      scrollInView(action.item, state.accordion2Open);
      return {
        ...state,
        accordion2Open: !state.accordion2Open,
      };
    case "TOGGLE_ACCORDION_3":
      scrollInView(action.item, state.accordion3Open);
      return {
        ...state,
        accordion3Open: !state.accordion3Open,
      };
    case "TOGGLE_ACCORDION_4":
      scrollInView(action.item, state.accordion4Open);
      return {
        ...state,
        accordion4Open: !state.accordion4Open,
      };
    case "TOGGLE_ACCORDION_5":
      scrollInView(action.item, state.accordion5Open);
      return {
        ...state,
        accordion5Open: !state.accordion5Open,
      };
    case "TOGGLE_ACCORDION_6":
      scrollInView(action.item, state.accordion6Open);
      return {
        ...state,
        accordion6Open: !state.accordion6Open,
      };
    case "TOGGLE_ACCORDION_7":
      scrollInView(action.item, state.accordion7Open);
      return {
        ...state,
        accordion7Open: !state.accordion7Open,
      };
    case "TOGGLE_ACCORDION_8":
      scrollInView(action.item, state.accordion8Open);
      return {
        ...state,
        accordion8Open: !state.accordion8Open,
      };
    case "TOGGLE_ACCORDION_9":
      scrollInView(action.item, state.accordion9Open);
      return {
        ...state,
        accordion9Open: !state.accordion9Open,
      };
    default:
      return state;
  }
}

export default function Page() {
  const accordionsInitialState = {
    accordion1Open: false,
    accordion2Open: false,
    accordion3Open: false,
    accordion4Open: false,
    accordion5Open: false,
    accordion6Open: false,
    accordion7Open: false,
    accordion8Open: false,
    accordion9Open: false,
  };

  const [accordionsState, setAccordionsState] = useReducer(
    reducer,
    accordionsInitialState
  );

  return (
    <>
      <section className="content container-padding">
        <div className="privacy-wrapper">
          <h1>سياسات تطبيق غلا لايف</h1>
          <div className="privacy-content-wrapper">
            <div className="accordion">
              <button
                className="accordion-item"
                onClick={(e) =>
                  setAccordionsState({
                    type: "TOGGLE_ACCORDION_1",
                    item: e.target,
                  })
                }
              >
                <span className="accordion-title">🏢 فتح وإنشاء وكالة</span>
                <span className="chevron-down">
                  <img
                    className={
                      "chevron-icon " +
                      (accordionsState.accordion1Open && "chevron-active")
                    }
                    src="/chevron-down.svg"
                    alt="open accordion"
                    draggable="false"
                  />
                </span>
              </button>
              <div
                className={`accordion-content ${
                  accordionsState.accordion1Open && "accordion-active"
                }`}
              >
                <p>
                  <strong>1. شروط فتح وكالة جديدة:</strong> لفتح وكالة مضيفين
                  يتطلب على الوكيل إحضار 3 داعمين و10 مستخدمين ولا مانع من فتح
                  الوكالة إن لم يتوفر العدد المطلوب إذا ضمن الوكيل فعالية وكالته
                  وتحقيقها لتارجت المطلوب وعليه تعبئة البيانات التالية : اسم
                  الوكالة / رقم الهاتف /ID الوكيل / الاسم الحقيقي.
                </p>
                <p>
                  <strong>2. تقييم أداء الوكالة:</strong> يتم متابعة إحصائية
                  الوكالة خلال شهر كامل اذا لم تكن متفاعلة على المستوى المطلوب
                  وحققت على الأقل تارجت 500$ يحق للإدارة ايقاف وسحب الوكالة
                  تلقائيآ..
                </p>
              </div>
            </div>
            <div className="accordion">
              <button
                className="accordion-item"
                onClick={(e) =>
                  setAccordionsState({
                    type: "TOGGLE_ACCORDION_2",
                    item: e.target,
                  })
                }
              >
                <span className="accordion-title">
                  🎁 مكافآت افتتاح الوكالات الجديدة
                </span>
                <span className="chevron-down">
                  <img
                    className={
                      "chevron-icon " +
                      (accordionsState.accordion2Open && "chevron-active")
                    }
                    src="/chevron-down.svg"
                    alt="open accordion"
                  />
                </span>
              </button>
              <div
                className={`accordion-content ${
                  accordionsState.accordion2Open && "accordion-active"
                }`}
              >
                <p>
                  <strong>5. خلال أول شهر:</strong>
                  <br />
                  عند افتتاح الوكالة يتم منح كلآ من الوكيل والداعمين vip4 لمدة
                  أسبوع ومنح 5 مشرفين vip3 لمدة أسبوع وvip2 ل 10 مستخدمين جدد
                  بالوكالة .
                </p>
              </div>
            </div>
            <div className="accordion">
              <button
                className="accordion-item"
                onClick={(e) =>
                  setAccordionsState({
                    type: "TOGGLE_ACCORDION_3",
                    item: e.target,
                  })
                }
              >
                <span className="accordion-title">🎉 الاحتفالات والمكافآت</span>
                <span className="chevron-down">
                  <img
                    className={
                      "chevron-icon " +
                      (accordionsState.accordion3Open && "chevron-active")
                    }
                    src="/chevron-down.svg"
                    alt="open accordion"
                    draggable="false"
                  />
                </span>
              </button>
              <div
                className={`accordion-content ${
                  accordionsState.accordion3Open && "accordion-active"
                }`}
              >
                <p>
                  <strong>3. حفل افتتاح الوكالة:</strong>
                  <br />
                  عند افتتاح الوكالة وقيام الوكيل بعمل حفل افتتاح يمنح الوكيل
                  بنر للإعلان عن الافتتاح وإذا تم الدعم فيها الئ مايقارب 8
                  ملايين كونز فإنه يتم منح الوكيل مليون كونز كمكافأة وvip5 لمدة
                  7 ايام.
                </p>
                <p>
                  <strong>4. مراكز التميز:</strong>
                  <br />
                  إذا حققت الوكالة أحد المراكز الثلاثة الأوائل على مستوى التطبيق
                  فإنه سيتم الإعلان عن مركزها على بنر خاص باسم الوكالة وحصول
                  الوكالة على وسام التميز ويمنح الوكيل vip5 لمدة 7 أيام و vip4
                  ل3 مشرفين فعالين بالوكالة وvip3 ل 8 مستخدمين فعالين.
                </p>
              </div>
            </div>
            <div className="accordion">
              <button
                className="accordion-item"
                onClick={(e) =>
                  setAccordionsState({
                    type: "TOGGLE_ACCORDION_4",
                    item: e.target,
                  })
                }
              >
                <span className="accordion-title">💎 الهدايا والدعم</span>
                <span className="chevron-down">
                  <img
                    className={
                      "chevron-icon " +
                      (accordionsState.accordion4Open && "chevron-active")
                    }
                    src="/chevron-down.svg"
                    alt="open accordion"
                    draggable="false"
                  />
                </span>
              </button>
              <div
                className={`accordion-content ${
                  accordionsState.accordion4Open && "accordion-active"
                }`}
              >
                <p>
                  <strong>6. تحويل الهدايا:</strong>
                  <br />
                  عند استلام المستخدم للهدايا داخل التطبيق يتم إضافة نفس القيمة
                  إلى محفظة الوكالة تحت مسمى الألماس.
                </p>
                <p>
                  <strong>13. كأس الروم:</strong>
                  <br />
                  يتم احتساب الدعم النازل بالوكالة في كأس الروم واستلام الوكيل
                  لمكافأة بنسبة معينة اسبوعيآ.
                </p>
                <p>
                  <strong>14. هدايا الحظ:</strong>
                  <br />
                  يتم احتساب هدايا الحظ في تارجت المضيف بنسبة 10%.
                </p>
              </div>
            </div>
            <div className="accordion">
              <button
                className="accordion-item"
                onClick={(e) =>
                  setAccordionsState({
                    type: "TOGGLE_ACCORDION_5",
                    item: e.target,
                  })
                }
              >
                <span className="accordion-title">💵 الرواتب والسحب</span>
                <span className="chevron-down">
                  <img
                    className={
                      "chevron-icon " +
                      (accordionsState.accordion5Open && "chevron-active")
                    }
                    src="/chevron-down.svg"
                    alt="open accordion"
                    draggable="false"
                  />
                </span>
              </button>
              <div
                className={`accordion-content ${
                  accordionsState.accordion5Open && "accordion-active"
                }`}
              >
                <p>
                  <strong>7. سحب الراتب بالدولار:</strong>
                  <br />
                  1$ = 7500 كونز للمستخدم، و8500 كونز لوكيل شحن.
                </p>
                <p>
                  <strong>
                    8. في حال عدم إكمال الوكيل أو المستخدم لعدد الأيام أو
                    الساعات المطلوبة فإنه سيتم .خصم 20٪من الراتب الشهري المستحق
                    وتحويل ماتبقى منه.
                  </strong>
                  <br />
                </p>
                <p>
                  <strong>12. رفع الراتب إلى وكيل الشحن:</strong>
                  <br />
                  يقوم المضيف برفع راتبه إلى وكيل شحن معتمد في دولته عند إنتهاء
                  الشهر مباشرة من تاريخ 1 وحتى تاريخ 5 وعلى وكيل الشحن تسليمه
                  الراتب في مدة اقصاها تاريخ 10 من نفس الشهر وأي تأخير من وكيل
                  الشحن يعرضه للمسائلة.
                </p>
              </div>
            </div>
            <div className="accordion">
              <button
                className="accordion-item"
                onClick={(e) =>
                  setAccordionsState({
                    type: "TOGGLE_ACCORDION_6",
                    item: e.target,
                  })
                }
              >
                <span className="accordion-title">
                  ⚠️ شروط النزول من الوكالة
                </span>
                <span className="chevron-down">
                  <img
                    className={
                      "chevron-icon " +
                      (accordionsState.accordion6Open && "chevron-active")
                    }
                    src="/chevron-down.svg"
                    alt="open accordion"
                    draggable="false"
                  />
                </span>
              </button>
              <div
                className={`accordion-content ${
                  accordionsState.accordion6Open && "accordion-active"
                }`}
              >
                <p>
                  <strong>9. وجود رصيد مستحق:</strong>
                  <br />
                  في حالة وجود رصيد مستحق في المحفظة فانه يمنع نهائيا تنزيل
                  المستخدم او طرده من الوكالة الا بعد تسوية الرصيد واستلامه
                  لراتبه كاملاً.
                </p>
                <p>
                  <strong>10. بدون رصيد:</strong>
                  <br />
                  في حال عدم وجود رصيد مستحق يتم تنزيل المستخدم من الوكالة في
                  الفترة المسموحة فقط للوكيل من تاريخ 1 وحتى تاريخ 5 في نفس
                  الشهر.
                </p>
                <p>
                  <strong>11. رفض التنزيل من الوكيل:</strong>
                  <br />
                  لايحق للوكيل رفض تنزيل أي مستخدم لايوجد لديه رصيد مستحق ولا
                  إجباره على البقاء بوكالته وفي هذه الحالة تقوم الإدارة بتنزيل
                  المستخدم بعد إرفاق مايؤيد ذلك.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="privacy-special">
        {/* <!-- subscriptions policy --> */}
        <section className="content container-padding table-section">
          <div className="privacy-wrapper">
            <div className="accordion">
              <button
                className="accordion-item"
                onClick={(e) =>
                  setAccordionsState({
                    type: "TOGGLE_ACCORDION_7",
                    item: e.target,
                  })
                }
              >
                <span className="accordion-title">
                  سياسة الوكالات و المضيفين
                </span>
                <span className="chevron-down">
                  <img
                    className={
                      "chevron-icon " +
                      (accordionsState.accordion7Open && "chevron-active")
                    }
                    src="/chevron-down.svg"
                    alt="open accordion"
                    draggable="false"
                  />
                </span>
              </button>
              {/* <!-- <h1>سياسة الوكالات و المضيفين</h1> --> */}
              <div
                className={`accordion-content ${
                  accordionsState.accordion7Open && "accordion-active"
                }`}
              >
                <div className="privacy-table">
                  <table className="subscriptions-table">
                    <thead>
                      <tr>
                        <th>المركبة و الاطار</th>
                        <th>
                          <span className="vib">جوائز VIB</span>
                        </th>
                        <th>رواتب الوكالة</th>
                        <th>رواتب المضيف</th>
                        <th>الايام</th>
                        <th>الالماس</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>7</td>
                        <td>1-7 days</td>
                        <td>4</td>
                        <td>22</td>
                        <td>10</td>
                        <td>250,000</td>
                      </tr>
                      <tr>
                        <td>7</td>
                        <td>1-10 days</td>
                        <td>8</td>
                        <td>44</td>
                        <td>10</td>
                        <td>500,000</td>
                      </tr>
                      <tr>
                        <td>7</td>
                        <td>1-15 days</td>
                        <td>16</td>
                        <td>87</td>
                        <td>10</td>
                        <td>1,000,000</td>
                      </tr>
                      <tr>
                        <td>10</td>
                        <td>1-30 days</td>
                        <td>24</td>
                        <td>127</td>
                        <td>10</td>
                        <td>1,500,000</td>
                      </tr>
                      <tr>
                        <td>10</td>
                        <td>2-10 days</td>
                        <td>40</td>
                        <td>205</td>
                        <td>-</td>
                        <td>2,500,000</td>
                      </tr>
                      <tr>
                        <td>10</td>
                        <td>2-15 days</td>
                        <td>56</td>
                        <td>285</td>
                        <td>-</td>
                        <td>3,500,000</td>
                      </tr>
                      <tr>
                        <td>10</td>
                        <td>2-30 days</td>
                        <td>80</td>
                        <td>405</td>
                        <td>-</td>
                        <td>5,000,000</td>
                      </tr>
                      <tr>
                        <td>15</td>
                        <td>3-10 days</td>
                        <td>120</td>
                        <td>605</td>
                        <td>-</td>
                        <td>7,500,000</td>
                      </tr>
                      <tr>
                        <td>15</td>
                        <td>3-15 days</td>
                        <td>160</td>
                        <td>805</td>
                        <td>-</td>
                        <td>10,000,000</td>
                      </tr>
                      <tr>
                        <td>15</td>
                        <td>3-30 days</td>
                        <td>200</td>
                        <td>1005</td>
                        <td>-</td>
                        <td>12,500,000</td>
                      </tr>
                      <tr>
                        <td>15</td>
                        <td>4-10 days</td>
                        <td>240</td>
                        <td>1205</td>
                        <td>-</td>
                        <td>15,000,000</td>
                      </tr>
                      <tr>
                        <td>20</td>
                        <td>4-15 days</td>
                        <td>320</td>
                        <td>1550</td>
                        <td>-</td>
                        <td>20,000,000</td>
                      </tr>
                      <tr>
                        <td>20</td>
                        <td>4-30 days</td>
                        <td>400</td>
                        <td>1950</td>
                        <td>-</td>
                        <td>25,000,000</td>
                      </tr>
                      <tr>
                        <td>20</td>
                        <td>4-30 days</td>
                        <td>480</td>
                        <td>2333</td>
                        <td>-</td>
                        <td>30,000,000</td>
                      </tr>
                      <tr>
                        <td>20</td>
                        <td>4-30 days</td>
                        <td>560</td>
                        <td>2640</td>
                        <td>-</td>
                        <td>35,000,000</td>
                      </tr>
                      <tr>
                        <td>20</td>
                        <td>4-30 days</td>
                        <td>640</td>
                        <td>3120</td>
                        <td>-</td>
                        <td>40,000,000</td>
                      </tr>
                      <tr>
                        <td>25</td>
                        <td>4-30 days</td>
                        <td>750</td>
                        <td>3900</td>
                        <td>-</td>
                        <td>50,000,000</td>
                      </tr>
                      <tr>
                        <td>25</td>
                        <td>5-10 days</td>
                        <td>850</td>
                        <td>5800</td>
                        <td>-</td>
                        <td>75,000,000</td>
                      </tr>
                      <tr>
                        <td>25</td>
                        <td>5-15 days</td>
                        <td>1250</td>
                        <td>7700</td>
                        <td>-</td>
                        <td>100,000,000</td>
                      </tr>
                      <tr>
                        <td>30</td>
                        <td>5-30 days</td>
                        <td>1680</td>
                        <td>9650</td>
                        <td>-</td>
                        <td>125,000,000</td>
                      </tr>
                      <tr>
                        <td>30</td>
                        <td>5-30 days</td>
                        <td>2100</td>
                        <td>11700</td>
                        <td>-</td>
                        <td>150,000,000</td>
                      </tr>
                      <tr>
                        <td>30</td>
                        <td>5-30 days</td>
                        <td>2600</td>
                        <td>15450</td>
                        <td>-</td>
                        <td>200,000,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="privacy-note">
                  <h2>ملاحظات هامة</h2>
                  <ul className="note-list">
                    <li>
                      يسمح للمستخدم بإنشاء حساب مضيف واحد فقط وإن اكتشف أي سلوك
                      احتيالي فسيتم اتخاذ الإجراءات المناسبة.
                    </li>
                    <li>
                      يجب تحقيق تاريخ الأيام وفي حالة عدم استكماله فسيتم خصم 20٪
                      من إجمالي راتب المضيف على المالك ساعتين يوم واحد فعال
                    </li>
                    <li>
                      يمكن رفع الراتب إلى وكيل الشحن بنهاية الشهر الحالي فقط
                      وندعم التحويل لأي منطقة في العالم
                    </li>
                    <li>
                      سعر الشحن داخل التطبيق من جوحل $1 = 7000 كوينز ومن وكيل
                      الشحن $1 = 8500 كوينز
                    </li>
                    <li>
                      يتم تصفير الرصيد في نهاية كل شهر ورفع الرواتب وفقا لتوقيت
                      المملكة العربية السعودية
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- new section --> */}
        <section className="content container-padding table-section">
          <div className="privacy-wrapper">
            <div className="accordion">
              <button
                className="accordion-item"
                onClick={(e) =>
                  setAccordionsState({
                    type: "TOGGLE_ACCORDION_8",
                    item: e.target,
                  })
                }
              >
                <span className="accordion-title">سياسة وكالات الشحن</span>
                <span className="chevron-down">
                  <img
                    className={
                      "chevron-icon " +
                      (accordionsState.accordion8Open && "chevron-active")
                    }
                    src="/chevron-down.svg"
                    alt="open accordion"
                    draggable="false"
                  />
                </span>
              </button>
              {/* <!-- <h1>سياسة وكالات الشحن</h1> --> */}
              <div
                className={`accordion-content ${
                  accordionsState.accordion8Open && "accordion-active"
                }`}
              >
                <div className="privacy-table">
                  <table className="subscriptions-table">
                    <thead>
                      <tr>
                        <th>مبلغ الشحن كاملا</th>
                        <th>البونص بالعملات</th>
                        <th>بونص الوكيل $</th>
                        <th>البلغ بالعملات</th>
                        <th>$ مبلغ الشحن</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>9,350,000</td>
                        <td>850,00</td>
                        <td>100</td>
                        <td>8,500,000</td>
                        <td>1,000</td>
                      </tr>
                      <tr>
                        <td>28,560,000</td>
                        <td>3,060,000</td>
                        <td>360</td>
                        <td>25,500,000</td>
                        <td>3,000</td>
                      </tr>
                      <tr>
                        <td>48,875,000</td>
                        <td>6,375,000</td>
                        <td>750</td>
                        <td>42,500,000</td>
                        <td>5,000</td>
                      </tr>
                      <tr>
                        <td>100,300,000</td>
                        <td>15,300,000</td>
                        <td>1,800</td>
                        <td>85,000,000</td>
                        <td>10,000</td>
                      </tr>
                      <tr>
                        <td>151,300,000</td>
                        <td>23,800,000</td>
                        <td>2,800</td>
                        <td>127,500,000</td>
                        <td>15,000</td>
                      </tr>
                      <tr>
                        <td>204,000,000</td>
                        <td>34,000,000</td>
                        <td>4,000</td>
                        <td>170,000,000</td>
                        <td>20,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="privacy-note">
                  <h2>ملاحظات هامة</h2>
                  <ul className="note-list">
                    <li>
                      لايمكن لوكلاء الشحن بيع أسعار الصرف، عدا بأسعار منخفضة
                      جداً أو مرتفعة جداً لتعطيل الخدمة، وعند اكتشاف ذلك سيتم
                      إلغاء مؤهلات وكيل الشحن.
                    </li>
                    <li>
                      لايمكن لوكلاء الشحن خداع المستخدمين، وعند اكتشاف ذلك سيتم
                      إنهاء التعاون.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- new section --> */}
        <section className="content container-padding table-section">
          <div className="privacy-wrapper">
            <div className="accordion">
              <button
                className="accordion-item"
                onClick={(e) =>
                  setAccordionsState({
                    type: "TOGGLE_ACCORDION_9",
                    item: e.target,
                  })
                }
              >
                <span className="accordion-title">قواعد مكافأة الغرفة</span>
                <span className="chevron-down">
                  <img
                    className={
                      "chevron-icon " +
                      (accordionsState.accordion9Open && "chevron-active")
                    }
                    src="/chevron-down.svg"
                    alt="open accordion"
                    draggable="false"
                  />
                </span>
              </button>
              {/* <!-- <h1>قواعد مكافأة الغرفة</h1> --> */}
              <div
                className={`accordion-content ${
                  accordionsState.accordion9Open && "accordion-active"
                }`}
              >
                <div className="privacy-table">
                  <table className="subscriptions-table">
                    <thead>
                      <tr>
                        <th>المستوي</th>
                        <th>هدف العملات الذهبية (اسبوع واحد)</th>
                        <th>مكافأة صاحب الغرفة</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>LV 1</td>
                        <td>500,000</td>
                        <td>20,000</td>
                      </tr>
                      <tr>
                        <td>LV 2</td>
                        <td>1,000,000</td>
                        <td>40,000</td>
                      </tr>
                      <tr>
                        <td>LV 3</td>
                        <td>3,000,000</td>
                        <td>90,000</td>
                      </tr>
                      <tr>
                        <td>LV 4</td>
                        <td>5,000,000</td>
                        <td>145,000</td>
                      </tr>
                      <tr>
                        <td>LV 5</td>
                        <td>7,000,000</td>
                        <td>200,000</td>
                      </tr>
                      <tr>
                        <td>LV 6</td>
                        <td>10,000,000</td>
                        <td>290,000</td>
                      </tr>
                      <tr>
                        <td>LV 7</td>
                        <td>16,000,000</td>
                        <td>450,000</td>
                      </tr>
                      <tr>
                        <td>LV 8</td>
                        <td>25,000,000</td>
                        <td>750,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
