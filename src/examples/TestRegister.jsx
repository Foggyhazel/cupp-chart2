import React from "react";
import {
  usePublishQuery,
  useRegisteredQueries
} from "../src/components/registry/hooks";
import QueryRegistry from "../src/components/registry/QueryRegistry";

const Test = ({ k }) => {
  usePublishQuery(() => {
    console.log(`test ${k}`);
  }, "test");
  return <p>test{k}</p>;
};

const Consumer = () => {
  const map = useRegisteredQueries();
  const handleClick = () => {
    Object.values(map).forEach(({ fn }) => fn());
  };
  return <button onClick={handleClick}>Update</button>;
};

export default function TestRegister() {
  return (
    <div>
      <h2> Example 1: main </h2>
      <div>
        <p>content</p>
        <QueryRegistry>
          <Test k={1} />
          <Test k={2} />
          <Consumer />
        </QueryRegistry>
      </div>
    </div>
  );
}
