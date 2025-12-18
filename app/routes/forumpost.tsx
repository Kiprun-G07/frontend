import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { apiFetch } from "~/lib/auth";
import dayjs from "dayjs";
import { useAuth } from "../lib/auth-context";
import { BiLike, BiSolidLike } from "react-icons/bi";


export function meta() {
  return [{ title: "Forum Post" }];
}

type Post = {
    id: number;
    title: string;
    content: string;
    user: {
        id: number;
        name: string;
    };
    created_at: Date;
    like_count: number;
    auth_user_liked: boolean;
    comments: {
        id: number;
        content: string;
        user: {
            id: number;
            name: string;
        };
        created_at: Date;
    }[];
};

export default function ForumPost() {
    const { id } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    const [newCommentContent, setNewCommentContent] = useState("");

    const [liked, setLiked] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function loadPost() {
            try {
                const res = await apiFetch(`/api/forum/posts/${id}`);
                const data = await res.json();
                if (!mounted) return;
                setPost(data.post);
                setLoading(false);

                setLiked(data.post.auth_user_like);
            } catch (err) {
                console.error('Failed to fetch forum post', err);
            } finally {
                if (mounted) setLoading(false);
            } 
        }
        loadPost();
        return () => { mounted = false; }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!post) {
        return <div>Post not found.</div>;
    }

    function submitComment(event: React.FormEvent) {
        event.preventDefault();
        apiFetch(`/api/forum/posts/${id}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: newCommentContent })
        }).then(async (res) => {
            if (res.ok) {
                const comment = await res.json();
                setPost(prevPost => {
                    if (!prevPost) return prevPost;
                    return {
                        ...prevPost,
                        comments: [...prevPost.comments, comment.comment]
                    };
                });
                setNewCommentContent("");
            } else {
                console.error('Failed to submit comment');
            }
        });
    }

    return (
        <main className="px-15 py-12 max-w-3xl mx-auto">
            <div className="content-card-alt">
                <div className="text-sm text-gray-500 mb-4">
                    Posted by <i>{post.user.name}</i> on {dayjs(post.created_at).format('MMMM D, YYYY h:mm A')}
                </div>
                <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                <div className="text-gray-700 whitespace-pre-wrap">
                    {post.content}
                </div>
                <div className="mt-6 mb-4">
                    <div className="flex items-center gap-2">
                        <button className="flex items-center py-1 rounded hover:cursor-pointer">
                            {liked ? <BiSolidLike size={24} onClick={() => {
                                apiFetch(`/api/forum/posts/${id}/unlike`, {
                                    method: "POST"
                                }).then(async (res) => {
                                    if (res.ok) {
                                        setPost(prevPost => {
                                            if (!prevPost) return prevPost;
                                            return {
                                                ...prevPost,
                                                like_count: prevPost.like_count - 1
                                            };
                                        });
                                        setLiked(false);
                                    } else {
                                        console.error('Failed to unlike post');
                                    }   
                                });
                            }} /> : <BiLike size={24} onClick={() => {
                                apiFetch(`/api/forum/posts/${id}/like`, {
                                    method: "POST"
                                }).then(async (res) => {
                                    if (res.ok) {
                                        setPost(prevPost => {
                                            if (!prevPost) return prevPost;
                                            return {
                                                ...prevPost,
                                                like_count: prevPost.like_count + 1
                                            };
                                        });
                                        setLiked(true);
                                    } else {
                                        console.error('Failed to like post');
                                    }
                                });
                            }} />}
                        </button>
                        <div>{post.like_count} {post.like_count === 1 ? "like" : "likes"}</div>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mt-8 mb-4">Comments</h2>
                    <form onSubmit={submitComment} className="mb-6">
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            rows={2}
                            placeholder="Add a comment..."
                            value={newCommentContent}
                            onChange={(e) => setNewCommentContent(e.target.value)}
                        ></textarea>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:cursor-pointer"
                        >
                            Comment
                        </button>
                    </form>

                    <div>
                        {post.comments.map(comment => (
                            <div key={comment.id} className="border-b border-gray-200 pb-4 mb-4">
                                <div className="text-sm text-gray-500 mb-2">
                                    <i>{comment.user.name}</i> on {dayjs(comment.created_at).format('MMMM D, YYYY h:mm A')}
                                </div>
                                <p className="text-gray-700">{comment.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
}