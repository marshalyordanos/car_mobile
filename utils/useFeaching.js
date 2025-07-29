import { useEffect, useState } from "react";

const useFeaching = (fn) => {
  const [data, setData] = useState([]);
  const [isLodding, setLodding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLodding(true);
      try {
        // const response = await getAll
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return { data };
};
