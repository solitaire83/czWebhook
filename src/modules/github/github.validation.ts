// https://docs.github.com/en/webhooks/webhook-events-and-payloads

type Repository = { 
    name: string; 
    full_name: string; 
    html_url: string 
};

export type Sender = { 
    login: string; 
    html_url: string; 
    avatar_url: string 
};

export type GithubPush = {
    ref: string;
    compare: string;
    deleted: boolean;
    repository: Repository;
    sender: Sender;
    commits: { id: string; message: string; url: string; author: { name: string; email: string; username?: string } }[];
};

export type GithubCreate = {
    ref: string;
    ref_type: "branch" | "tag";
    repository: Repository;
    sender: Sender;
};

export type GithubRelease = {
    action: string;
    release: { tag_name: string; html_url: string };
    repository: Repository;
    sender: Sender;
};

export type GithubCheckRun = {
    action: string;
    check_run: {
        name: string;
        conclusion: string | null;
        html_url: string;
        head_sha: string;
        check_suite: { head_branch: string | null };
    };
    repository: Repository;
};

export type GithubCheckSuite = {
    action: string;
    check_suite: {
        conclusion: string | null;
        head_branch: string | null;
        head_sha: string;
        app: { name: string };
    };
    repository: Repository;
};
