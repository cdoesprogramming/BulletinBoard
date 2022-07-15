import { useDispatch } from "react-redux";
import { reactionAdded } from "./posts/postsSlice";

const reactionEmoji = {
    thumbsUp: '👍🏾',
    wow: '😮',
    heart: '❤️',
    rocket: '🚀',
    coffee: '☕️'
}

const ReactionButtons = ({ post }) => {
    const dispatch = useDispatch()
    // Object.entries is mapping over the reactionEmoji object. The name is the key and the emoji is the value
    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
           <button
            key={name}
            type="button"
            className="reactionButton"
            onClick={() => 
                dispatch(reactionAdded({ postId: post.id, reaction: name}))
            }
        >
        {emoji} {post.reactions[name]}
            </button>
        )
    })

    return <div>{reactionButtons}</div>
}
export default ReactionButtons