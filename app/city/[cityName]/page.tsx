import CityClient from "./ui";

export default function CityPage({ params }: { params: { cityName: string } }) {
  return <CityClient cityName={decodeURIComponent(params.cityName)} />;
}
