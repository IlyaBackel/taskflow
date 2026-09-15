import type { BoardMemberWithProfile } from "../../types/boardMember";


interface AssigneeSelectProps {
    members: BoardMemberWithProfile[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export default function AssigneeSelect({
    members,
    value,
    onChange,
    error,
}: AssigneeSelectProps) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1 text-primary-text">
                Assignee *
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${error ? 'border-red-500' : 'border-border-primary'
                    } bg-card-bg text-primary-text focus:outline-none focus:ring-2 focus:ring-primary`}
            >
                <option value="">Select assignee...</option>
                {members.map((member) => {
                    const profile = member.profiles?.[0];
                    if (!profile) return null;
                    return (
                        <option key={profile.id} value={profile.id}>
                            {profile.name || profile.email}
                        </option>
                    );
                })}
            </select>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
}