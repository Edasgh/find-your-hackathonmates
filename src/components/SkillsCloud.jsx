function SkillsCloud({ skilsArr = [] }) {
  return (
    <div className="flex flex-wrap gap-2 w-full">
      {skilsArr?.length != 0 &&
        skilsArr?.map((skill, index) => (
          <span
            key={index}
            className="inline-block text-bgPrimary font-semibold py-1 px-5 text-xs rounded-3xl bg-textPrimary"
          >
            {skill}
          </span>
        ))}
    </div>
  );
}

export default SkillsCloud;
