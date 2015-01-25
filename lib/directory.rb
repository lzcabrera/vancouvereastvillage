require 'geocoder'
require 'json'

module DirectoryData
  class AddressGeocoder
    attr_reader :data

    def initialize(data)
      @data = data
    end

    def find_location(update_all)

      if(update_all || !has_coordinates?)
        coord = geocode(address)
        if coord.nil?
          yield "Unable to find coordinates for #{data["name"]}" if block_given?
          return
        end
        data["lat"] = coord[0]
        data["lng"] = coord[1]
        yield "Found coordinates for #{data["name"]}" if block_given?
        #throttle requests to API to avoid errors
        sleep 0.1
      end

    end

    def geocode(place_name)
      return nil if place_name.nil?
      Geocoder.coordinates(place_name)
    end

    def has_coordinates?
      data.has_key?("lng") and data.has_key?("lat")
    end

    def address
      data["address"]+'Vancouver, BC'
    end

    def location_text
      Geocoder.coordinates(data["address"])
    end

    def self.from_hash(data)
      self.new(data)
    end

  end
end