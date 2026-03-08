"use client";
import { useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

export default function EditProfile({
  UserId,
  UserName,
  UserEmail,
  UserCountry,
  UserGithubID,
  UserBio,
  UserSkills,
}) {
  // to show floating labels if focused on input fields
  const [focusObj, setFocusObj] = useState({
    nameFocus: true,
    emailFocus: true,
    ghFocus: true,
    descFocus: true,
    skillsFocus: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tId = toast.loading("Please wait....");

    try {
      const data = new FormData(e.currentTarget);
      const name = data.get("name");
      const country = data.get("country");
      const bio = data.get("bio");
      const githubID = data.get("githubID");
      const skills = data.get("skills");
      const email = data.get("email");

      const skillsArr = [...skills.split(",")];
      const totalSkills = skillsArr.filter((s) => s.trim() !== "").length;

      const userObj = {
        id: UserId,
        name,
        email,
        githubID,
        bio,
        skills: skillsArr,
        country,
      };

      if (
        name === "" ||
        email == "" ||
        githubID == "" ||
        bio == "" ||
        country === ""
      ) {
        toast.update(tId, {
          render: "User details can't be empty!",
          type: "error",
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
        });
        return;
      }

      if (
        name === UserName &&
        email === UserEmail &&
        githubID === UserGithubID &&
        bio === UserBio &&
        country === UserCountry &&
        skills.toString() === UserSkills.toString()
      ) {
        toast.update(tId, {
          render: "No changes made to save!",
          type: "info",
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
        });
        return;
      }

      if (!skills.includes(",") || totalSkills < 5) {
        toast.update(tId, {
          render: !skills.includes(",")
            ? "Please separate skills with commas!"
            : "At least 5 skills are required!",
          type: "error",
          isLoading: false,
          autoClose: 1200, // Slightly longer so they can read the specific error
          closeButton: true,
        });
        return;
      }

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userObj),
      });

      if (response.status === 200) {
        toast.update(tId, {
          render: "Changes Saved Successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          closeButton: true,
        });
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        throw new Error("Something went wrong!");
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
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="login-signup-form"
        id="signup"
      >
        <div className="flex flex-wrap gap-2">
          <div className="input-div">
            <input
              type="text"
              defaultValue={UserName}
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
              defaultValue={UserCountry}
              onChange={(e) => {
                e.preventDefault();
              }}
              title="Country"
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
              defaultValue={UserEmail}
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
              defaultValue={UserGithubID}
              onFocus={() => {
                setFocusObj((prev) => ({ ...prev, ghFocus: true }));
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setFocusObj((prev) => ({ ...prev, ghFocus: false }));
                } else {
                  setFocusObj((prev) => ({ ...prev, ghFocus: true }));
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
              defaultValue={UserBio}
              onFocus={() => {
                setFocusObj((prev) => ({ ...prev, descFocus: true }));
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setFocusObj((prev) => ({ ...prev, descFocus: false }));
                } else {
                  setFocusObj((prev) => ({ ...prev, descFocus: true }));
                }
              }}
              id="bio"
              name="bio"
              aria-describedby="bio"
              className="text-textPrimary"
              style={{ height: "13rem" }}
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
              defaultValue={UserSkills}
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
                  setFocusObj((prev) => ({ ...prev, skillsFocus: true }));
                }
              }}
              id="skills"
              name="skills"
              aria-describedby="skills"
              className="text-textPrimary"
              style={{ height: "13rem" }}
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

        <button
          className="signup-submit text-textPrimary hover:bg-textBgPrimaryHv hover:text-black hover:text-center px-1 py-2 border-[1px] rounded-md border-textBgPrimaryHv"
          type="submit"
          id="signup-btn"
          suppressHydrationWarning
        >
          Save Changes
        </button>
      </form>
    </>
  );
}
