
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  UserPlus, 
  MessageSquare, 
  Users, 
  Award, 
  Coins, 
  Gift, 
  Flame,
  ChevronDown
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

// Mock friend data
interface Friend {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  coins: number;
  streak: number;
  level: number;
}

const friends: Friend[] = [
  { id: '1', name: 'Sarah Johnson', avatar: '', status: 'online', coins: 450, streak: 15, level: 8 },
  { id: '2', name: 'Miguel Reyes', avatar: '', status: 'online', coins: 320, streak: 7, level: 6 },
  { id: '3', name: 'Emily Chen', avatar: '', status: 'busy', coins: 580, streak: 24, level: 11 },
  { id: '4', name: 'Jamal Williams', avatar: '', status: 'offline', coins: 210, streak: 3, level: 5 },
  { id: '5', name: 'Aisha Patel', avatar: '', status: 'away', coins: 750, streak: 32, level: 14 }
];

// Suggested friends
const suggestedFriends: Friend[] = [
  { id: '6', name: 'Ryan Thompson', avatar: '', status: 'offline', coins: 180, streak: 5, level: 4 },
  { id: '7', name: 'Olivia Martinez', avatar: '', status: 'online', coins: 320, streak: 12, level: 7 },
  { id: '8', name: 'David Kim', avatar: '', status: 'offline', coins: 410, streak: 9, level: 6 }
];

// Study groups
interface StudyGroup {
  id: string;
  name: string;
  members: number;
  subject: string;
}

const studyGroups: StudyGroup[] = [
  { id: '1', name: 'Calculus Study Group', members: 8, subject: 'Mathematics' },
  { id: '2', name: 'Web Development Pro', members: 12, subject: 'Computer Science' },
  { id: '3', name: 'Physics Exam Prep', members: 6, subject: 'Physics' }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-green-500';
    case 'busy': return 'bg-red-500';
    case 'away': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

const FriendCard = ({ friend }: { friend: Friend }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={friend.avatar} />
            <AvatarFallback>{friend.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(friend.status)}`}></div>
        </div>
        <div>
          <h3 className="font-medium">{friend.name}</h3>
          <div className="flex gap-3 mt-1">
            <div className="flex items-center text-xs text-muted-foreground">
              <Flame className="h-3 w-3 mr-1 text-orange-500" />
              <span>{friend.streak} day streak</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Award className="h-3 w-3 mr-1 text-blue-500" />
              <span>Level {friend.level}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center mr-2">
          <Coins className="h-4 w-4 text-yellow-500" />
          <span className="ml-1 font-medium">{friend.coins}</span>
        </div>
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Gift className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const SuggestedFriendCard = ({ friend }: { friend: Friend }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={friend.avatar} />
          <AvatarFallback>{friend.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{friend.name}</h3>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Award className="h-3 w-3 mr-1 text-blue-500" />
            <span>Level {friend.level}</span>
          </div>
        </div>
      </div>
      <Button size="sm" variant="outline" className="gap-1">
        <UserPlus className="h-4 w-4" />
        Add
      </Button>
    </div>
  );
};

const GroupCard = ({ group }: { group: StudyGroup }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50">
      <div>
        <h3 className="font-medium">{group.name}</h3>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            <span>{group.members} members</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {group.subject}
          </Badge>
        </div>
      </div>
      <Button size="sm">Join</Button>
    </div>
  );
};

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Friends</h1>
            <p className="text-muted-foreground">
              Connect with friends and study together
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                className="pl-9 w-[200px] md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <UserPlus className="mr-1 h-4 w-4" />
              Add Friend
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="friends" className="w-full">
          <TabsList>
            <TabsTrigger value="friends">My Friends</TabsTrigger>
            <TabsTrigger value="suggested">Suggested</TabsTrigger>
            <TabsTrigger value="groups">Study Groups</TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends" className="mt-4">
            <div className="space-y-4">
              {filteredFriends.length > 0 ? (
                filteredFriends.map(friend => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FriendCard friend={friend} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                  <h3 className="mt-2 text-lg font-medium">No friends found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? "Try different search terms" : "Add some friends to get started"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="suggested" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Friend Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedFriends.map(friend => (
                  <SuggestedFriendCard key={friend.id} friend={friend} />
                ))}
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <Button variant="ghost" className="gap-1">
                  <ChevronDown className="h-4 w-4" />
                  Show More
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="groups" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Study Groups</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {studyGroups.map(group => (
                    <GroupCard key={group.id} group={group} />
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline">Browse All Groups</Button>
                  <Button>Create New Group</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                    <h3 className="mt-2 font-medium">No groups joined yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Join a study group to collaborate with others
                    </p>
                    <Button className="mt-4">Find Groups</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Friends;
