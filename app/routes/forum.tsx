import { useAuth } from "../lib/auth-context";
import { Link, useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import { apiFetch } from "~/lib/auth";
import dayjs from "dayjs"
import { BiLike } from "react-icons/bi";


export function meta() {
    return [
        { title: "Forum" },
        { name: "description", content: "Discussion Forum" },
    ];
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
};

type NewPost = {
    title: string;
    content: string;
};

export default function Forum() {
    const { user, loading, setUser } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState<NewPost>({ title: "", content: "" });
    const [likeCounts, setLikeCounts] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        apiFetch('/api/forum/posts').then(async (res) => {
            if (res.ok) {
                const posts = await res.json();
                setPosts(posts.posts);
                console.log(posts);
            }
        }).catch((err) => {
            console.error('Failed to fetch forum posts', err);
        });
    }, []);

    function createPost(event: React.FormEvent) {
        event.preventDefault();
        
        apiFetch('/api/forum/posts', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPostContent)
            
        }).then(async (res) => {
            if (res.ok) {
                const post = await res.json();
                setPosts(prevPosts => [post.post, ...prevPosts]);
                setNewPostContent({ title: "", content: "" });
            }
        });
    }

    return (
        <main className="px-15 py-12">
            <div className="main-content grid grid-cols-3 gap-5 justify-center pb-12">
                <div className="content-card h-full col-span-1">
                    <div className="text-xl font-medium mb-4">GPS Forums</div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">Got something to share?</h2>
                        <div>
                            <form onSubmit={createPost}>
                                <input
                                    type="text"
                                    className="w-full border rounded-xl shadow-lg p-2 mb-2"
                                    placeholder="Post Title"
                                    required
                                    value={newPostContent.title}
                                    onChange={(e) => setNewPostContent({ ...newPostContent, title: e.target.value })}
                                />
                                <textarea
                                    className="w-full border rounded-xl shadow-lg p-2 mb-2"
                                    rows={3}
                                    placeholder="Write your post here..."
                                    required
                                    value={newPostContent.content}
                                    onChange={(e) => setNewPostContent({ ...newPostContent, content: e.target.value })}
                                ></textarea>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:cursor-pointer"
                                >
                                    Post
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="content-card h-full col-span-2">
                    <div>
                        {posts && posts.map((post) => (
                            <div key={post.id} className="content-card-alt mb-4">
                                <Link to={`/forum/post/${post.id}`} className="`">
                                    <div className="text-sm text-gray-500 mt-1 mb-1">
                                        Posted by <i>{post.user.name}</i> on {dayjs(post.created_at).format('MMMM D, YYYY h:mm A')}
                                    </div>
                                    <h3 className="text-xl font-semibold">{post.title}</h3>
                                    <p className="text-gray-700">{post.content}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}