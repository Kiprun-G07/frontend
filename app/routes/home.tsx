import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useAuth } from "../lib/auth-context";
import { apiFetch } from "../lib/auth";
import dayjs from "dayjs"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GPS UTM" },
    { name: "description", content: "Gerakan Pengunaan Siswa!" },
  ];
}
import { Link } from "react-router";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading, setUser } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [upcomingEvent, setUpcomingEvent] = useState<any>();

  useEffect(() => {
    apiFetch('/api/events').then(async (res) => {
      if (res.ok) {
        const events = await res.json();
        setEvents(events);
      }
    }).catch((err) => {
      console.error('Failed to fetch user profile', err);
    });

    apiFetch('api/upcoming').then(async (res) => {
      if (res.ok) {
        const upcomingEvent = await res.json();
        setUpcomingEvent(upcomingEvent);
      }
    }).catch((err) => {
      console.error('Failed to fetch user profile', err);
    });
  }, []);

  if (user && events && events.length > 0){
    return (
      <main className="px-15 py-12">
        <div className="text-3xl font-bold mb-6">
          <div>
            Upcoming Events

            {upcomingEvent && (
              <div className="text-lg font-normal mt-2 text-gray-600">
                Reminder: You joined {upcomingEvent.event_name && upcomingEvent.event_name} on {dayjs(upcomingEvent.event_date && upcomingEvent.event_date).format('ddd, MMM D, YYYY')}
              </div>
            )}
          </div>
        </div>
        {/* <section className="max-w-3xl mx-auto">
          
          <div className="mt-8">
            Logged in as {user.name ?? user.email}
          </div>
        </section> */}
        <div className="main-content flex flex-row items-top gap-5 justify-center pb-12">
          <div className="content-card h-full  flex-1 flex-grow">
            <div className="mb-2 text-sm font-medium uppercase text-gray-600">COMING SOON</div>
            <div className="text-xl font-medium">{events[0].event_name}</div>
            <div className="font-medium text-gray-600 mb-6">{dayjs(events[0].event_date).format('ddd, MMM D, YYYY')}</div>

            <div className="font-medium text-gray-600">{events[0].event_description}</div>

            <div className="w-full min-h-50 bg-amber-100 my-6">
                          {event.event_image_url && (
                            <img src={event.event_image_url} alt={event.event_name} className="w-full h-full object-cover" />
                          )}
                        </div>

            <Link to={`/event/${events[0].id}`} className="font-medium p-2 bg-blue-600 text-white rounded">Join</Link>
          </div>
          <div className="content-card h-full  flex-1 flex-grow">
            <div className="mb-2 text-sm font-medium uppercase text-gray-600">COMING SOON</div>
            <div className="text-xl font-medium">{events[1].event_name}</div>
            <div className="font-medium text-gray-600 mb-6">{dayjs(events[1].event_date).format('ddd, MMM D, YYYY')}</div>

            <div className="font-medium text-gray-600">{events[1].event_description}</div>

            <div className="w-full min-h-50 bg-amber-100 my-6">
                          {event.event_image_url && (
                            <img src={event.event_image_url} alt={event.event_name} className="w-full h-full object-cover" />
                          )}
                        </div>

            <Link to={`/event/${events[1].id}`} className="font-medium p-2 bg-blue-600 text-white rounded">Join</Link>
          </div>
          <div className="content-card h-full  flex-1 flex-grow">
            <div className="mb-2 text-sm font-medium uppercase text-gray-600">COMING SOON</div>
            <div className="text-xl font-medium">{events[2].event_name}</div>
            <div className="font-medium text-gray-600 mb-6">{dayjs(events[2].event_date).format('ddd, MMM D, YYYY')}</div>

            <div className="font-medium text-gray-600">{events[2].event_description}</div>

            <div className="w-full min-h-50 bg-amber-100 my-6">
                          {event.event_image_url && (
                            <img src={event.event_image_url} alt={event.event_name} className="w-full h-full object-cover" />
                          )}
                        </div>

            <Link to={`/event/${events[2].id}`} className="font-medium p-2 bg-blue-600 text-white rounded">Join</Link>
          </div>

        </div>
      </main>
    );
  } else if (!user && events.length > 0){ 
    return (
      <main className="px-15 ">
        <Welcome />
        <div className="text-3xl font-bold mb-6 mt-12 flex flex-row justify-between">
          <div>
            Upcoming Events
          </div>
          <Link to="/register" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded">Sign Up</Link>
        </div>
        <div className="main-content flex flex-row items-top gap-5 justify-center pb-12">
          <div className="content-card h-full  flex-1 flex-grow">
            <div className="mb-2 text-sm font-medium uppercase text-gray-600">COMING SOON</div>
            <div className="text-xl font-medium">{events[0].event_name}</div>
            <div className="font-medium text-gray-600 mb-6">{dayjs(events[0].event_date).format('ddd, MMM D, YYYY')}</div>

            <div className="font-medium text-gray-600">{events[0].event_description}</div>

            <div className="w-full min-h-50 bg-amber-100 my-6">
                          {event.event_image_url && (
                            <img src={event.event_image_url} alt={event.event_name} className="w-full h-full object-cover" />
                          )}
                        </div>

            <Link to={`/event/${events[0].id}`} className="font-medium p-2 bg-blue-600 text-white rounded">Join</Link>
          </div>
          <div className="content-card h-full  flex-1 flex-grow">
            <div className="mb-2 text-sm font-medium uppercase text-gray-600">COMING SOON</div>
            <div className="text-xl font-medium">{events[1].event_name}</div>
            <div className="font-medium text-gray-600 mb-6">{dayjs(events[1].event_date).format('ddd, MMM D, YYYY')}</div>

            <div className="font-medium text-gray-600">{events[1].event_description}</div>

            <div className="w-full h-50 bg-amber-100 my-6">

            </div>

            <Link to={`/event/${events[1].id}`} className="font-medium p-2 bg-blue-600 text-white rounded">Join</Link>
          </div>
          <div className="content-card h-full  flex-1 flex-grow">
            <div className="mb-2 text-sm font-medium uppercase text-gray-600">COMING SOON</div>
            <div className="text-xl font-medium">{events[2].event_name}</div>
            <div className="font-medium text-gray-600 mb-6">{dayjs(events[2].event_date).format('ddd, MMM D, YYYY')}</div>

            <div className="font-medium text-gray-600">{events[2].event_description}</div>

            <div className="w-full min-h-50 bg-amber-100 my-6">
                          {event.event_image_url && (
                            <img src={event.event_image_url} alt={event.event_name} className="w-full h-full object-cover" />
                          )}
                        </div>

            <Link to={`/event/${events[2].id}`} className="font-medium p-2 bg-blue-600 text-white rounded">Join</Link>
          </div>

        </div>
      </main>
    );
  }
}
