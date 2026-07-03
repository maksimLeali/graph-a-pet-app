import { SimpleImageEditor } from "@components";

type Props = {
	open: boolean;
	onClose: () => void;
	userId: string;
	mediaId?: string;
	onSaved: (newMediaId: string) => void;
};

const MAIN_SCOPE = "profile_picture";
const DEMOTE_SCOPE = "user_picture";

export const ProfileImageEditor: React.FC<Props> = ({
	open,
	onClose,
	userId,
	mediaId,
	onSaved,
}) => (
	<SimpleImageEditor
		open={open}
		onClose={onClose}
		refId={userId}
		scope={MAIN_SCOPE}
		demote={mediaId ? { mediaId, scope: DEMOTE_SCOPE } : undefined}
		previewMediaId={mediaId}
		onSaved={onSaved}
	/>
);
