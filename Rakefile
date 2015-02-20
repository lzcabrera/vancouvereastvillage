require 'yaml'
require 'json'
require './lib/directory'
require './lib/instagram'
require 'middleman-gh-pages'


def geocode_address(update_all)
  data_path = 'directory.yml'
  puts "Geocoding records from #{data_path}... "

  data = YAML.load_file(File.expand_path("./data/#{data_path}"))
  data["locations"].each do |location|
    DirectoryData::AddressGeocoder.from_hash(location).find_location(update_all)
  end

  File.open(File.expand_path("../data/#{data_path}", __FILE__), "w") do |f|
    YAML.dump(data, f)
  end
end

def instagram_photos
  data_path = 'instagram.json'

  if ENV["INSTAGRAM_API_KEY"].nil?
    puts "Set ENV['INSTAGRAM_API_KEY'] to connect to the instagram.com API"
    return false
  end

  puts "Getting #vaneastvillage photos from http://instagram.com/developer/ for #{data_path}..."

  file = File.read(File.expand_path("./data/#{data_path}"))
  data = JSON.parse(file)

  InstagramData::PhotoCollector.from_hash(data).find_photos

  File.open(File.expand_path("../data/#{data_path}", __FILE__), "w") do |f|
    f.write(JSON.pretty_generate(data))
  end

end

desc "Get Instagram photos tagged #vaneastvillage"
task :instagram do |t, args|
  instagram_photos
end

desc "Find coordinates for locations"
task :geocode do |t, args|
  geocode_address(ENV['force'])
end
