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

const countries = [
  "Afghanistan",
  "Åland Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia (Plurinational State of)",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Caribbean Netherlands",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands",
  "Colombia",
  "Comoros",
  "Congo",
  "Congo, Democratic Republic of the",
  "Cook Islands",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czech Republic",
  "Côte d'Ivoire",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini (Swaziland)",
  "Ethiopia",
  "Falkland Islands (Malvinas)",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and Mcdonald Islands",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Lao People's Democratic Republic",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Macedonia North",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar (Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Palau",
  "Palestinian Territory",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russian Federation",
  "Rwanda",
  "Saint Barthélemy",
  "Saint Helena",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Sweden",
  "Switzerland",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

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

      const skillsArr = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

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
            <h1
              title="sign up"
              className="text-center section-title text-textPrimary poppins-semibold text-[28px]"
            >
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
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
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
