"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageCircle,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Users,
  BookOpen,
  Briefcase,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for conversations
const mockConversations = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/professional-woman.png",
    lastMessage: "Thanks for the React session! The hooks explanation was really helpful.",
    timestamp: "2 min ago",
    unread: 2,
    type: "learning",
    online: true,
  },
  {
    id: 2,
    name: "Frontend Dev Team",
    avatar: "/team-group.jpg",
    lastMessage: "Alex: The wireframes look great! When can we start coding?",
    timestamp: "15 min ago",
    unread: 0,
    type: "internship",
    online: false,
    isGroup: true,
  },
  {
    id: 3,
    name: "Dr. Kumar",
    avatar: "/wise-professor.png",
    lastMessage: "I've uploaded the ML resources we discussed. Check them out!",
    timestamp: "1 hour ago",
    unread: 1,
    type: "learning",
    online: true,
  },
  {
    id: 4,
    name: "Analytics Pro Project",
    avatar: "/analytics-dashboard.png",
    lastMessage: "The data visualization is coming along nicely. Great work!",
    timestamp: "3 hours ago",
    unread: 0,
    type: "internship",
    online: false,
    isGroup: true,
  },
]

// Mock messages for selected conversation
const mockMessages = [
  {
    id: 1,
    sender: "Sarah Chen",
    content: "Hey! Thanks for offering to help with React. I'm really struggling with useEffect.",
    timestamp: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    content: "No problem! useEffect can be tricky at first. What specific part are you having trouble with?",
    timestamp: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Sarah Chen",
    content:
      "I'm not sure when to use the dependency array and when to leave it empty. Sometimes my components re-render infinitely!",
    timestamp: "10:33 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "You",
    content:
      "Ah, that's a common issue! Let me explain the three main patterns:\n\n1. No dependency array: runs after every render\n2. Empty array []: runs only once after mount\n3. With dependencies [value]: runs when dependencies change",
    timestamp: "10:35 AM",
    isOwn: true,
  },
  {
    id: 5,
    sender: "Sarah Chen",
    content: "That makes so much more sense! Can we schedule a quick call to go over some examples?",
    timestamp: "10:37 AM",
    isOwn: false,
  },
  {
    id: 6,
    sender: "You",
    content: "How about tomorrow at 2 PM? I can share my screen and we can code together.",
    timestamp: "10:38 AM",
    isOwn: true,
  },
  {
    id: 7,
    sender: "Sarah Chen",
    content: "Perfect! Thanks so much. You're a lifesaver! 🙏",
    timestamp: "10:39 AM",
    isOwn: false,
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "learning":
        return <BookOpen className="h-3 w-3" />
      case "internship":
        return <Briefcase className="h-3 w-3" />
      default:
        return <MessageCircle className="h-3 w-3" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "learning":
        return (
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
            Learning
          </Badge>
        )
      case "internship":
        return (
          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
            Internship
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-2rem)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
                Messages
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="space-y-1 p-3">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedConversation.id === conversation.id ? "bg-emerald-50 border border-emerald-200" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {conversation.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                              {conversation.isGroup && <Users className="h-3 w-3 text-gray-400" />}
                            </div>
                            <div className="flex items-center gap-1">
                              {getTypeIcon(conversation.type)}
                              <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 truncate mb-2">{conversation.lastMessage}</p>
                          <div className="flex items-center justify-between">
                            {getTypeBadge(conversation.type)}
                            {conversation.unread > 0 && (
                              <Badge
                                variant="destructive"
                                className="h-5 w-5 p-0 text-xs flex items-center justify-center"
                              >
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2 flex flex-col">
            {/* Chat Header */}
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedConversation.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConversation.online && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {selectedConversation.online ? "Online" : "Last seen 2 hours ago"}
                      </span>
                      {getTypeBadge(selectedConversation.type)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-16rem)] p-4">
                <div className="space-y-4">
                  {mockMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] ${message.isOwn ? "order-2" : "order-1"}`}>
                        <div
                          className={`p-3 rounded-lg ${
                            message.isOwn ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${message.isOwn ? "text-right" : "text-left"}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-10"
                  />
                  <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
