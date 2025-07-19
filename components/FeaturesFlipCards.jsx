import React from "react";
import FlipCard from "@/components/FlipCard";
import { features } from "@/data/features";

/// ... existing code ...
// ... existing imports ...
// ... existing imports ...
const FeaturesFlipCards = () => (
  <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "2rem",
    justifyContent: "center",
    margin: "2rem 0"
  }}>
    {features.map((feature, idx) => (
      <div
        key={idx}
        className="p-2 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700"
        style={{ width: "300px", height: "200px" }}
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl w-full h-full overflow-hidden">
          <FlipCard
            front={
              <img
                src={feature.image}
                alt={feature.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            }
            back={
              <div style={{
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
              }}>
                <div>{feature.icon}</div>
                <h3 style={{ margin: "0.5rem 0" }}>{feature.title}</h3>
                <p style={{ margin: "0.5rem 0" }}>{feature.description}</p>
                <small>{feature.details}</small>
              </div>
            }
            width="100%"
            height="100%"
          />
        </div>
      </div>
    ))}
  </div>
);

export default FeaturesFlipCards;