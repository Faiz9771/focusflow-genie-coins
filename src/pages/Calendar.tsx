
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { motion } from 'framer-motion';

// Sample events data
const events = [
  { id: 1, title: "Math Assignment Due", date: addDays(new Date(), 2), category: "academic" },
  { id: 2, title: "Group Project Meeting", date: addDays(new Date(), 1), category: "work" },
  { id: 3, title: "Gym Session", date: new Date(), category: "personal" },
  { id: 4, title: "Research Paper Review", date: addDays(new Date(), 4), category: "academic" },
  { id: 5, title: "Call with Mentor", date: addDays(new Date(), 3), category: "work" }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "academic":
      return "bg-blue-100 text-blue-600";
    case "personal":
      return "bg-purple-100 text-purple-600";
    case "work":
      return "bg-emerald-100 text-emerald-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  
  const dateEvents = events.filter(event => 
    format(event.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground">
              View and manage your schedule and events
            </p>
          </div>
          
          <Button className="mt-2 md:mt-0" size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Event
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Monthly Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="font-medium">
                    {format(month, 'MMMM yyyy')}
                  </div>
                  <Button variant="outline" size="icon" onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  month={month}
                  onMonthChange={setMonth}
                />
              </CardContent>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center pb-2">
                  <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">
                    Events for {format(selectedDate, 'MMMM d, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dateEvents.length > 0 ? (
                    <div className="space-y-3">
                      {dateEvents.map(event => (
                        <div 
                          key={event.id} 
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/50"
                        >
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className={getCategoryColor(event.category)}>
                                {event.category}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Details</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No events scheduled for this day</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="mr-1 h-4 w-4" />
                        Add Event
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .slice(0, 5)
                    .map(event => (
                      <div key={event.id} className="flex items-center gap-3">
                        <div className="rounded-md bg-secondary p-2 w-12 h-12 flex flex-col items-center justify-center text-center">
                          <span className="text-xs">{format(event.date, 'MMM')}</span>
                          <span className="font-bold">{format(event.date, 'd')}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{event.title}</p>
                          <Badge variant="outline" className={`${getCategoryColor(event.category)} mt-1`}>
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar;
