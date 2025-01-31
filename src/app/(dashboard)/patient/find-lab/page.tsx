"use client";

import React, { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import {
  Search,
  MapPin,
  Clock,
  Phone,
  Building2,
  Beaker,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Lab {
  id: string;
  email: string;
  labName: string;
  address: string;
  phone: string;
  operatingHours: {
    openingTime: string;
    closingTime: string;
  };
  services: string[];
  state: string;
  town: string;
}

const statesAndTowns: { [key: string]: string[] } = {
  Enugu: ["Enugu North", "Enugu South", "Nsukka"],
  Lagos: ["Ikeja", "Lekki", "Victoria Island"],
  Abuja: ["Garki", "Maitama", "Wuse"],
};

export default function FindLab() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedTown, setSelectedTown] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("all");

  const fetchLabs = useCallback(async () => {
    try {
      const labsRef = collection(db, "users");
      const q = query(labsRef, where("role", "==", "lab"));
      const querySnapshot = await getDocs(q);

      const labsData: Lab[] = [];
      querySnapshot.forEach((doc) => {
        labsData.push({ id: doc.id, ...doc.data() } as Lab);
      });

      setLabs(labsData);
      setFilteredLabs(labsData);
      setError("");
    } catch (err) {
      setError("Failed to fetch labs. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  useEffect(() => {
    if (selectedState === "all") {
      setSelectedTown("all");
    }
  }, [selectedState]);

  const filterLabs = useCallback(() => {
    let filtered = [...labs];

    if (selectedState !== "all") {
      filtered = filtered.filter((lab) => lab.state === selectedState);
    }

    if (selectedTown !== "all") {
      filtered = filtered.filter((lab) => lab.town === selectedTown);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (lab) =>
          lab.labName.toLowerCase().includes(search) ||
          lab.address.toLowerCase().includes(search) ||
          lab.services.some((service) => service.toLowerCase().includes(search))
      );
    }

    if (selectedService !== "all") {
      filtered = filtered.filter((lab) =>
        lab.services.includes(selectedService)
      );
    }

    setFilteredLabs(filtered);
  }, [selectedState, selectedTown, searchTerm, selectedService, labs]);

  useEffect(() => {
    filterLabs();
  }, [filterLabs]);

  const getAllServices = useCallback(() => {
    const servicesSet = new Set<string>();
    labs.forEach((lab) => {
      lab.services.forEach((service) => servicesSet.add(service));
    });
    return Array.from(servicesSet);
  }, [labs]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find a Lab</h1>
        <p className="text-gray-600 mt-2">
          Search for accredited laboratories in your area
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Search labs or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All States</SelectItem>
                {Object.keys(statesAndTowns).map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={selectedTown}
            onValueChange={setSelectedTown}
            disabled={selectedState === "all"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Town" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Towns</SelectItem>
                {selectedState !== "all" &&
                  statesAndTowns[selectedState]?.map((town) => (
                    <SelectItem key={town} value={town}>
                      {town}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger>
              <SelectValue placeholder="Select Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Services</SelectItem>
                {getAllServices().map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredLabs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No labs found</h3>
          <p className="text-gray-600 mt-2">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map((lab) => (
            <Card key={lab.id}>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">{lab.labName}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
