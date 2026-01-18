"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Turn {
  id: string;
  visitorId: string;
  argument: string;
  timestamp: string;
  score: number | null;
}

interface Debate {
  id: string;
  topic: string;
  status: string;
  turns: Turn[];
}

export default function DebateRoom() {
  const params = useParams();
  const debateId = params.id as string;

  const [debate, setDebate] = useState<Debate | null>(null);
  const [argument, setArgument] = useState("");
  const [visitorId] = useState(() => 
    typeof window !== "undefined" 
      ? localStorage.getItem("visitorId") || crypto.randomUUID()
      : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visitorId) {
      localStorage.setItem("visitorId", visitorId);
    }
  }, [visitorId]);

  // fetch debate data
  useEffect(() => {
    const fetchDebate = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/debates/${debateId}`);
        const data = await response.json();
        setDebate(data);
      } catch (error) {
        console.error("Failed to fetch debate:", error);
      }
    };

    fetchDebate();
  }, [debateId]);

  // submit a turn
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!argument.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch(`http://localhost:8080/api/debates/${debateId}/turns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, argument }),
      });

      // refresh debate data to show new turn
      const response = await fetch(`http://localhost:8080/api/debates/${debateId}`);
      const data = await response.json();
      setDebate(data);
      setArgument("");
    } catch (error) {
      console.error("Failed to submit turn:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!debate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">🍳 Debate Room</h1>
          <h2 className="text-xl text-gray-700">{debate.topic}</h2>
          <p className="text-sm text-gray-500 mt-2">Room ID: {debate.id}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Arguments</h3>
          
          {debate.turns.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No arguments yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {debate.turns.map((turn) => (
                <div 
                  key={turn.id} 
                  className={`p-4 rounded-lg ${
                    turn.visitorId === visitorId 
                      ? "bg-orange-100 ml-8" 
                      : "bg-gray-100 mr-8"
                  }`}
                >
                  <p className="text-gray-800">{turn.argument}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {turn.visitorId === visitorId ? "You" : "Opponent"} • 
                    {new Date(turn.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <textarea
            value={argument}
            onChange={(e) => setArgument(e.target.value)}
            placeholder="Type your argument..."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-orange-500"
            rows={3}
          />
          <button
            type="submit"
            disabled={isSubmitting || !argument.trim()}
            className="mt-4 w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Argument"}
          </button>
        </form>
      </div>
    </div>
  );
}