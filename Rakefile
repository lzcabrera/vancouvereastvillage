require 'yaml'
require './lib/directory'


def geocode_address
  data_path = 'directory.yml'
  puts "Geocoding records from #{data_path}... "

  data = YAML.load_file(File.expand_path("./data/#{data_path}"))
  data["locations"].each do |location|
    DirectoryData::AddressGeocoder.from_hash(location).find_location{|msg| puts msg}
  end

  File.open(File.expand_path("../data/#{data_path}", __FILE__), "w") do |f|
    YAML.dump(data, f)
  end
end

desc "Find coordinates for locations"
task :geocode do
  geocode_address
end