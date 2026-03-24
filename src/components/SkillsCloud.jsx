function SkillsCloud({ skilsArr = [] }) {
  
  const cleanedSkills = [
    ...new Set(
      skilsArr
        .map((skill) => skill.trim().toLowerCase())
        .filter((skill) => skill !== ""),
    ),
  ];
  
  return (
    <div className="flex flex-wrap gap-2 w-full">
      {cleanedSkills?.length != 0 &&
        cleanedSkills?.map((skill, index) => (
          <span
            key={index}
            className="inline-block text-bgPrimary font-semibold py-0.5 px-3 text-xs rounded-3xl bg-textPrimary"
          >
            {skill}
          </span>
        ))}
    </div>
  );
}

export default SkillsCloud;
