"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import Link from "next/link";

import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "../loading";
import Footer from "@/components/Footer";
import { useCreds } from "@/hooks/useCreds";

const urlRegex = /^(https?:\/\/[^\s< >\{\}\[\]]+)$/;

export default function Signup() {
  const { user, isLoading, error } = useCreds();
  //router
  const router = useRouter();

  useLayoutEffect(() => {
    if (!isLoading && user) {
      router.push("/teams");
    }
  }, [isLoading, user, router]);

  // access password & confirm password value
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // to get if the password & confirm password are the same
  const [isSame, setIsSame] = useState(true);
  const [isStrong, setIsStrong] = useState(false);

  // to show floating labels if focused on input fields
  const [focusObj, setFocusObj] = useState({
    nameFocus: false,
    passWFocus: false,
    CpassWFocus: false,
    emailFocus: false,
    ghFocus: false,
    descFocus: false,
    skillsFocus: false,
  });
  // to show / hide the password
  const [isShown, setIsShown] = useState(false);
  const [isCPShown, setIsCPShown] = useState(false);

  function matchWPassword(e) {
    if (e.target.value === password) {
      setIsSame(true);
    } else {
      setIsSame(false);
    }
  }

  function matchWCPassword(e) {
    if (e.target.value === confirmPassword) {
      setIsSame(true);
    } else {
      setIsSame(false);
    }
  }

  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  function checkPasswordStrength(password = "") {
    if (passwordRegex.test(password)) {
      setIsStrong(true);
    } else {
      setIsStrong(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tId = toast.loading("Signing you up....");
    if (!isStrong) {
      toast.update(tId, {
        render: "Weak Password!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });

      return;
    }
    if (!isSame) {
      toast.update(tId, {
        render: "Password & Confirm Password should be same",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });

      return;
    }

    try {
      const data = new FormData(e.currentTarget);
      const name = data.get("name");
      const country = data.get("country");
      const bio = data.get("bio");
      const githubID = data.get("githubID");
      const skills = data.get("skills");
      const email = data.get("email");
      const password = data.get("password");

      const skillsArr = [...skills.split(",")];

      if (urlRegex.test(githubID)) {
        throw new Error("Not a valid github ID");
      }

      if (skills.includes(",") && skillsArr.length >= 5) {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            githubID,
            bio,
            skills: skillsArr,
            country,
            password,
          }),
        });

        if (response.status === 201) {
          toast.update(tId, {
            render: "Signed up Successfully!",
            type: "success",
            isLoading: false,
            autoClose: 2000,
            closeButton: true,
          });
          router.push("/login");
        } else {
          throw new Error("Something went wrong! try another email");
        }
      } else {
        toast.update(tId, {
          render:
            "Skills should be ',' separated and Atleast 5 skills should be added!",
          type: "error",
          isLoading: false,
          autoClose: 2000,
          closeButton: true,
        });
      }
    } catch (error) {
      toast.update(tId, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });
    }
  };

  const onFocusStyle = {
    padding: "0 0.5rem",
    color: " var(--text-secondary)",
    transform: " translate(-10px, -17px) scale(0.8)",
    zIndex: "8",
  };

  const getStyle = (isFocus) => {
    return isFocus ? onFocusStyle : { display: "inherit" };
  };

  return (
    <>
      {isLoading ? (
        <>
          <LoadingComponent />
        </>
      ) : (
        <>
          <div className="main-div w-1/3 max-[900px]:w-full  p-7 m-auto mt-10 flex flex-col gap-2 justify-center items-center">
            <h1 title="sign up" className="text-center section-title text-textPrimary poppins-semibold text-[28px]">
              Join The Community Now!
            </h1>
            <form
              onSubmit={handleSubmit}
              className="login-signup-form"
              id="signup"
            >
              <div className="flex flex-wrap gap-2">
                <div className="input-div">
                  <input
                    type="text"
                    onFocus={() => {
                      setFocusObj((prev) => ({ ...prev, nameFocus: true }));
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        setFocusObj((prev) => ({ ...prev, nameFocus: false }));
                      } else {
                        setFocusObj((prev) => ({ ...prev, nameFocus: true }));
                      }
                    }}
                    id="name"
                    name="name"
                    aria-describedby="name"
                    className="text-textPrimary"
                    suppressHydrationWarning
                    required
                  />
                  <label
                    htmlFor="name"
                    className="labelLine"
                    style={getStyle(focusObj.nameFocus)}
                  >
                    Name
                  </label>
                </div>

                <div className="input-div">
                  <select
                    className="form-select text-textSecondary"
                    autoComplete="country"
                    id="country"
                    name="country"
                    defaultValue={"India"}
                    onChange={(e) => {
                      e.preventDefault();
                    }}
                    title="country"
                    suppressHydrationWarning
                    required
                  >
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Åland Islands">Åland Islands</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="American Samoa">American Samoa</option>
                    <option value="Andorra">Andorra</option>
                    <option value="Angola">Angola</option>
                    <option value="Anguilla">Anguilla</option>
                    <option value="Antarctica">Antarctica</option>
                    <option value="Antigua and Barbuda">
                      Antigua and Barbuda
                    </option>
                    <option value="Argentina">Argentina</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Aruba">Aruba</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahamas">Bahamas</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Barbados">Barbados</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Belize">Belize</option>
                    <option value="Benin">Benin</option>
                    <option value="Bermuda">Bermuda</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="Bolivia (Plurinational State of)">
                      Bolivia (Plurinational State of)
                    </option>
                    <option value="Bosnia and Herzegovina">
                      Bosnia and Herzegovina
                    </option>
                    <option value="Botswana">Botswana</option>
                    <option value="Bouvet Island">Bouvet Island</option>
                    <option value="Brazil">Brazil</option>
                    <option value="British Indian Ocean Territory">
                      British Indian Ocean Territory
                    </option>
                    <option value="Brunei Darussalam">Brunei Darussalam</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Cabo Verde">Cabo Verde</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Canada">Canada</option>
                    <option value="Caribbean Netherlands">
                      Caribbean Netherlands
                    </option>
                    <option value="Cayman Islands">Cayman Islands</option>
                    <option value="Central African Republic">
                      Central African Republic
                    </option>
                    <option value="Chad">Chad</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Christmas Island">Christmas Island</option>
                    <option value="Cocos (Keeling) Islands">
                      Cocos (Keeling) Islands
                    </option>
                    <option value="Colombia">Colombia</option>
                    <option value="Comoros">Comoros</option>
                    <option value="Congo">Congo</option>
                    <option value="Congo, Democratic Republic of the">
                      Congo, Democratic Republic of the
                    </option>
                    <option value="Cook Islands">Cook Islands</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Curaçao">Curaçao</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Dominica">Dominica</option>
                    <option value="Dominican Republic">
                      Dominican Republic
                    </option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Egypt">Egypt</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Eswatini (Swaziland)">
                      Eswatini (Swaziland)
                    </option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Falkland Islands (Malvinas)">
                      Falkland Islands (Malvinas)
                    </option>
                    <option value="Faroe Islands">Faroe Islands</option>
                    <option value="Fiji">Fiji</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="French Guiana">French Guiana</option>
                    <option value="French Polynesia">French Polynesia</option>
                    <option value="French Southern Territories">
                      French Southern Territories
                    </option>
                    <option value="Gabon">Gabon</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Gibraltar">Gibraltar</option>
                    <option value="Greece">Greece</option>
                    <option value="Greenland">Greenland</option>
                    <option value="Grenada">Grenada</option>
                    <option value="Guadeloupe">Guadeloupe</option>
                    <option value="Guam">Guam</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Guernsey">Guernsey</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Guinea-Bissau">Guinea-Bissau</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Haiti">Haiti</option>
                    <option value="Heard Island and Mcdonald Islands">
                      Heard Island and Mcdonald Islands
                    </option>
                    <option value="Honduras">Honduras</option>
                    <option value="Hong Kong">Hong Kong</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Iceland">Iceland</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Isle of Man">Isle of Man</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Japan">Japan</option>
                    <option value="Jersey">Jersey</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kiribati">Kiribati</option>
                    <option value="Korea, North">Korea, North</option>
                    <option value="Korea, South">Korea, South</option>
                    <option value="Kosovo">Kosovo</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                    <option value="Lao People's Democratic Republic">
                      Lao People's Democratic Republic
                    </option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Libya">Libya</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Macao">Macao</option>
                    <option value="Macedonia North">Macedonia North</option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Mali">Mali</option>
                    <option value="Malta">Malta</option>
                    <option value="Marshall Islands">Marshall Islands</option>
                    <option value="Martinique">Martinique</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Mayotte">Mayotte</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Micronesia">Micronesia</option>
                    <option value="Moldova">Moldova</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Myanmar (Burma)">Myanmar (Burma)</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Nauru">Nauru</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Netherlands Antilles">
                      Netherlands Antilles
                    </option>
                    <option value="New Caledonia">New Caledonia</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Niger">Niger</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Niue">Niue</option>
                    <option value="Norfolk Island">Norfolk Island</option>
                    <option value="Northern Mariana Islands">
                      Northern Mariana Islands
                    </option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Palau">Palau</option>
                    <option value="Palestinian Territory">
                      Palestinian Territory
                    </option>{" "}
                    <option value="Panama">Panama</option>{" "}
                    <option value="Papua New Guinea">Papua New Guinea</option>{" "}
                    <option value="Paraguay">Paraguay</option>{" "}
                    <option value="Peru">Peru</option>{" "}
                    <option value="Philippines">Philippines</option>{" "}
                    <option value="Pitcairn">Pitcairn</option>{" "}
                    <option value="Poland">Poland</option>{" "}
                    <option value="Portugal">Portugal</option>{" "}
                    <option value="Puerto Rico">Puerto Rico</option>{" "}
                    <option value="Qatar">Qatar</option>{" "}
                    <option value="Reunion">Reunion</option>{" "}
                    <option value="Romania">Romania</option>{" "}
                    <option value="Russian Federation">
                      Russian Federation
                    </option>{" "}
                    <option value="Rwanda">Rwanda</option>{" "}
                    <option value="Saint Barthélemy">Saint Barthélemy</option>{" "}
                    <option value="Saint Helena">Saint Helena</option>{" "}
                    <option value="Saint Kitts and Nevis">
                      Saint Kitts and Nevis
                    </option>{" "}
                    <option value="Saint Lucia">Saint Lucia</option>{" "}
                    <option value="Saint Martin">Saint Martin</option>{" "}
                    <option value="Saint Pierre and Miquelon">
                      Saint Pierre and Miquelon
                    </option>{" "}
                    <option value="Saint Vincent and the Grenadines">
                      Saint Vincent and the Grenadines
                    </option>{" "}
                    <option value="Samoa">Samoa</option>{" "}
                    <option value="San Marino">San Marino</option>{" "}
                    <option value="Sao Tome and Principe">
                      Sao Tome and Principe
                    </option>{" "}
                    <option value="Saudi Arabia">Saudi Arabia</option>{" "}
                    <option value="Senegal">Senegal</option>{" "}
                    <option value="Serbia">Serbia</option>{" "}
                    <option value="Seychelles">Seychelles</option>{" "}
                    <option value="Sierra Leone">Sierra Leone</option>{" "}
                    <option value="Singapore">Singapore</option>{" "}
                    <option value="Slovakia">Slovakia</option>{" "}
                    <option value="Slovenia">Slovenia</option>{" "}
                    <option value="Solomon Islands">Solomon Islands</option>{" "}
                    <option value="Somalia">Somalia</option>{" "}
                    <option value="South Africa">South Africa</option>{" "}
                    <option value="South Georgia">South Georgia</option>{" "}
                    <option value="South Sudan">South Sudan</option>{" "}
                    <option value="Spain">Spain</option>{" "}
                    <option value="Sri Lanka">Sri Lanka</option>{" "}
                    <option value="Sudan">Sudan</option>{" "}
                    <option value="Suriname">Suriname</option>{" "}
                    <option value="Svalbard and Jan Mayen">
                      Svalbard and Jan Mayen
                    </option>{" "}
                    <option value="Sweden">Sweden</option>{" "}
                    <option value="Switzerland">Switzerland</option>{" "}
                    
                    <option value="Taiwan">Taiwan</option>{" "}
                    <option value="Tajikistan">Tajikistan</option>{" "}
                    <option value="Tanzania">Tanzania</option>{" "}
                    <option value="Thailand">Thailand</option>{" "}
                    <option value="Timor-Leste">Timor-Leste</option>{" "}
                    <option value="Togo">Togo</option>{" "}
                    <option value="Tokelau">Tokelau</option>{" "}
                    <option value="Tonga">Tonga</option>{" "}
                    <option value="Trinidad and Tobago">
                      Trinidad and Tobago
                    </option>{" "}
                    <option value="Tunisia">Tunisia</option>{" "}
                    <option value="Turkey">Turkey</option>{" "}
                    <option value="Turkmenistan">Turkmenistan</option>{" "}
                    <option value="Turks and Caicos Islands">
                      Turks and Caicos Islands
                    </option>{" "}
                    <option value="Tuvalu">Tuvalu</option>{" "}
                    <option value="Uganda">Uganda</option>{" "}
                    <option value="Ukraine">Ukraine</option>{" "}
                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>{" "}
                    <option value="United Kingdom">United Kingdom</option>{" "}
                    <option value="United States">United States</option>{" "}
                    <option value="Uruguay">Uruguay</option>{" "}
                    <option value="Uzbekistan">Uzbekistan</option>{" "}
                    <option value="Vanuatu">Vanuatu</option>{" "}
                    <option value="Vatican City">Vatican City</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Western Sahara">Western Sahara</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="input-div">
                  <input
                    type="email"
                    onFocus={() => {
                      setFocusObj((prev) => ({ ...prev, emailFocus: true }));
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        setFocusObj((prev) => ({
                          ...prev,
                          emailFocus: false,
                        }));
                      } else {
                        setFocusObj((prev) => ({
                          ...prev,
                          emailFocus: true,
                        }));
                      }
                    }}
                    id="email"
                    name="email"
                    aria-describedby="emailSignup"
                    className="text-textPrimary"
                    suppressHydrationWarning
                    required
                  />
                  <label
                    htmlFor="email"
                    className="labelLine"
                    style={getStyle(focusObj.emailFocus)}
                  >
                    Email
                  </label>
                </div>
                <div className="input-div">
                  <input
                    type="text"
                    onFocus={() => {
                      setFocusObj((prev) => ({ ...prev, ghFocus: true }));
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        setFocusObj((prev) => ({
                          ...prev,
                          ghFocus: false,
                        }));
                      } else {
                        setFocusObj((prev) => ({
                          ...prev,
                          ghFocus: true,
                        }));
                      }
                    }}
                    id="githubID"
                    name="githubID"
                    aria-describedby="githubID"
                    className="text-textPrimary"
                    suppressHydrationWarning
                    required
                  />
                  <label
                    htmlFor="githubID"
                    className="labelLine"
                    style={getStyle(focusObj.ghFocus)}
                  >
                    Github ID
                  </label>
                </div>
              </div>
              <span className="text-xs mb-2.5 text-textBgPrimaryHv hidden min-[480px]:block w-auto max-[480px]:max-w-56">
                *Skills should be ',' separated. Eg.: React.js, Node.js,
                Docker,MongoDB*
                <br />
                <br />
                *Atleast 5 skills should be added*
              </span>
              <div className="flex flex-wrap gap-2">
                <div className="input-div">
                  <textarea
                    onFocus={() => {
                      setFocusObj((prev) => ({ ...prev, descFocus: true }));
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        setFocusObj((prev) => ({
                          ...prev,
                          descFocus: false,
                        }));
                      } else {
                        setFocusObj((prev) => ({ ...prev, descFocus: true }));
                      }
                    }}
                    id="bio"
                    name="bio"
                    aria-describedby="bio"
                    className="text-textPrimary"
                    maxLength={100}
                    suppressHydrationWarning
                    required
                  ></textarea>
                  <label
                    htmlFor="bio"
                    className="labelLine"
                    style={
                      focusObj.descFocus
                        ? { ...onFocusStyle }
                        : { display: "inherit" }
                    }
                  >
                    Bio
                  </label>
                </div>
                <span className="text-xs mb-2.5 text-textBgPrimaryHv hidden max-[480px]:block w-auto max-[500px]:max-w-56">
                  *Skills should be ',' separated. Eg.: React.js, Node.js,
                  Docker,MongoDB*
                  <br />
                  <br />
                  *Atleast 5 skills should be added*
                </span>
                <div className="input-div">
                  <textarea
                    onFocus={() => {
                      setFocusObj((prev) => ({ ...prev, skillsFocus: true }));
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        setFocusObj((prev) => ({
                          ...prev,
                          skillsFocus: false,
                        }));
                      } else {
                        setFocusObj((prev) => ({
                          ...prev,
                          skillsFocus: true,
                        }));
                      }
                    }}
                    id="skills"
                    name="skills"
                    aria-describedby="skills"
                    className="text-textPrimary"
                    title="Atleast 5 Skills should be added!"
                    suppressHydrationWarning
                    required
                  ></textarea>
                  <label
                    htmlFor="skills"
                    className="labelLine"
                    style={getStyle(focusObj.skillsFocus)}
                  >
                    Skills
                  </label>
                </div>
              </div>
              <span
                className={
                  isSame
                    ? "text-xs mb-3.5 text-textSecondary opacity-100 w-auto max-[480px]:max-w-56"
                    : "text-xs mb-3.5 text-[#fa6d6d] opacity-100 w-auto max-[480px]:max-w-56"
                }
              >
                *password & confirm password should be same*
              </span>
              {password !== "" && (
                <span
                  className={
                    isStrong
                      ? "text-xs mb-3.5 text-green-500 opacity-100 w-auto max-[480px]:max-w-56"
                      : "text-xs mb-3.5 text-[#fa6d6d] opacity-100 w-auto max-[480px]:max-w-56"
                  }
                >
                  {isStrong
                    ? "*Password Strength : Strong*"
                    : "*Password Strength : Weak*"}
                </span>
              )}
              <div className="flex flex-wrap gap-2">
                <div className="input-div">
                  <input
                    type={isShown ? "text" : "password"}
                    className="form-control text-textPrimary"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      matchWCPassword(e);
                      checkPasswordStrength(e.target.value);
                    }}
                    onFocus={(e) => {
                      setFocusObj((prev) => ({ ...prev, passWFocus: true }));
                      matchWCPassword(e);
                      checkPasswordStrength(e.target.value);
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        setFocusObj((prev) => ({
                          ...prev,
                          passWFocus: false,
                        }));
                      } else {
                        setFocusObj((prev) => ({ ...prev, passWFocus: true }));
                      }

                      matchWCPassword(e);
                      checkPasswordStrength(e.target.value);
                    }}
                    name="password"
                    id="password"
                    minLength={8}
                    suppressHydrationWarning
                    required
                  />
                  <span
                    className={
                      "absolute top-2 left-[82%] w-[6.5rem] bg-transparent z-10"
                    }
                  >
                    <FontAwesomeIcon
                      icon={isShown ? faEyeSlash : faEye}
                      className="cursor-pointer"
                      onClick={() => {
                        setIsShown(!isShown);
                        document.getElementById("password").focus();
                      }}
                    />
                  </span>
                  <label
                    htmlFor="password"
                    className="labelLine"
                    style={getStyle(focusObj.passWFocus)}
                  >
                    Password
                  </label>
                </div>

                <div className="input-div">
                  <input
                    type={isCPShown ? "text" : "password"}
                    className="form-control text-textPrimary"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      matchWPassword(e);
                    }}
                    onFocus={(e) => {
                      setFocusObj((prev) => ({ ...prev, CpassWFocus: true }));
                      matchWPassword(e);
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        setFocusObj((prev) => ({
                          ...prev,
                          CpassWFocus: false,
                        }));
                      } else {
                        setFocusObj((prev) => ({ ...prev, CpassWFocus: true }));
                      }

                      matchWPassword(e);
                    }}
                    name="confirmPassword"
                    id="confirmPassword"
                    minLength={8}
                    suppressHydrationWarning
                    required
                  />
                  <span
                    className={
                      "absolute top-2 left-[82%] w-[6.5rem] bg-transparent z-10"
                    }
                  >
                    <FontAwesomeIcon
                      icon={isCPShown ? faEyeSlash : faEye}
                      className="cursor-pointer"
                      onClick={() => {
                        setIsCPShown(!isCPShown);
                        document.getElementById("confirmPassword").focus();
                      }}
                    />
                  </span>
                  <label
                    htmlFor="confirmPassword"
                    className="labelLine"
                    style={getStyle(focusObj.CpassWFocus)}
                  >
                    Confirm Password
                  </label>
                </div>
              </div>

              <p className="text-sm my-2 text-textPrimary">
                Already have an account ?{" "}
                <Link href="/login" className="text-textSecondary underline">
                  LogIn
                </Link>
              </p>

              <button
                className="signup-submit text-textPrimary hover:bg-textBgPrimaryHv hover:text-black hover:text-center px-1 py-2 w-[10rem] border-[1px] rounded-md border-textBgPrimaryHv"
                type="submit"
                id="signup-btn"
                suppressHydrationWarning
              >
                Join
              </button>
            </form>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
