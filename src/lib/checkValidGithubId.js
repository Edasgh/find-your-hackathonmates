export const checkValidGithubId = async (username) => {
    try {
        const res = await fetch(`https://api.github.com/users/${username}`,{
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            },
        });
        return res.status === 200;
    } catch (err) {
        return false;
    }
};

const parseGitHubUrl = (url) => {
    const regex = /^https?:\/\/(www\.)?github\.com\/([^\/\s]+)(\/([^\/\s]+))?/;
    const match = url.match(regex);

    if (!match) return null;

    return {
        username: match[2],
        repo: match[4] || null,
    };
};

export const checkGithubUrlExists = async (url) => {
    const parsed = parseGitHubUrl(url);

    if (!parsed) return false;

    const { username, repo } = parsed;

    try {
        const apiUrl = repo
            ? `https://api.github.com/repos/${username}/${repo}`
            : `https://api.github.com/users/${username}`;

        const res = await fetch(apiUrl,{
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            },
        });
        return res.status === 200;
    } catch {
        return false;
    }
};

export const isValidGithubUrl = (url) => {
    try {
        const parsed = new URL(url);
        return (
            ["http:", "https:"].includes(parsed.protocol) &&
            parsed.hostname === "github.com"
        );
    } catch {
        return false;
    }
};