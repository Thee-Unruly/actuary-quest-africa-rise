
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Plus, User, Trophy, Clock } from "lucide-react";
import { toast } from "sonner";

export const CommunityHub = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Sarah M.",
      avatar: "SM",
      title: "Help with Probability Calculations",
      content: "I'm struggling with the probability concepts in Quest 2. Can someone explain how to calculate the expected value for life insurance premiums?",
      tags: ["probability", "life-insurance"],
      likes: 12,
      replies: 5,
      timeAgo: "2 hours ago",
      isLiked: false
    },
    {
      id: 2,
      author: "Alex Chen",
      avatar: "AC",
      title: "Study Group for Advanced Quests",
      content: "Looking to form a study group for the advanced property risk assessment quest. Anyone interested in collaborating?",
      tags: ["study-group", "advanced"],
      likes: 8,
      replies: 3,
      timeAgo: "4 hours ago",
      isLiked: true
    },
    {
      id: 3,
      author: "Jordan K.",
      avatar: "JK", 
      title: "Sandbox Tips: Optimal Pricing Strategy",
      content: "After many simulations, I found that keeping loss ratios between 65-75% gives the best results. Here are my findings...",
      tags: ["sandbox", "tips"],
      likes: 25,
      replies: 12,
      timeAgo: "1 day ago",
      isLiked: false
    }
  ]);

  const [newPost, setNewPost] = useState({ title: "", content: "", tags: "" });
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleNewPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    const post = {
      id: posts.length + 1,
      author: "You",
      avatar: "YOU",
      title: newPost.title,
      content: newPost.content,
      tags: newPost.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      likes: 0,
      replies: 0,
      timeAgo: "just now",
      isLiked: false
    };

    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "", tags: "" });
    setShowNewPostForm(false);
    toast.success("Post created successfully!");
  };

  const topContributors = [
    { name: "Jordan K.", avatar: "JK", badge: "Risk Guru", posts: 23, likes: 156 },
    { name: "Alex Chen", avatar: "AC", badge: "Helper", posts: 18, likes: 98 },
    { name: "Sarah M.", avatar: "SM", badge: "Learner", posts: 12, likes: 67 }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            Community Mini-Hub
          </CardTitle>
          <CardDescription>
            Connect with fellow actuarial students, share knowledge, and form study groups
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* New Post Button */}
          <Card>
            <CardContent className="pt-6">
              {!showNewPostForm ? (
                <Button 
                  onClick={() => setShowNewPostForm(true)}
                  className="w-full bg-purple-500 hover:bg-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Post
                </Button>
              ) : (
                <div className="space-y-4">
                  <Input
                    placeholder="Post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Share your question, tip, or form a study group..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  />
                  <Input
                    placeholder="Tags (comma separated: probability, insurance, tips)"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleNewPost} className="bg-purple-500 hover:bg-purple-600">
                      Post
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Posts Feed */}
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-purple-500 text-white">{post.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{post.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{post.content}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 ${post.isLiked ? 'text-red-500' : 'text-gray-600'}`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    {post.replies} replies
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-sm font-bold text-gray-400 w-4">
                    #{index + 1}
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-purple-500 text-white text-xs">
                      {contributor.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{contributor.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {contributor.badge}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      {contributor.posts} posts • {contributor.likes} likes
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Popular Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["probability", "insurance", "tips", "study-group", "life-insurance", "sandbox", "advanced", "beginner"].map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-purple-50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Alex Chen</span> replied to <span className="text-purple-600">"Study Group"</span>
                <div className="text-xs text-gray-600">5 min ago</div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Jordan K.</span> liked your post
                <div className="text-xs text-gray-600">15 min ago</div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Sarah M.</span> joined the community
                <div className="text-xs text-gray-600">1 hour ago</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
