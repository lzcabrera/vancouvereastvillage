require 'faraday'

module InstagramData
  class PhotoCollector
    attr_reader :data
    attr_reader :api_key
    attr_reader :instagram_connection

    def initialize(data)
      @data = data
      @instagram_connection = Faraday.new(:url => 'https://api.instagram.com') do |faraday|
        faraday.request  :url_encoded
        faraday.adapter  Faraday.default_adapter
      end
    end

    def find_photos
      response = instagram_connection.get '/v1/tags/vaneastvillage/media/recent', {:client_id => ENV["INSTAGRAM_API_KEY"] }
      assert_ok(response)
    end

    def assert_ok(response)
      if response.status != 200
        puts "Unable to get photos from instagram.com"
        return false
      end

      data['instagram'] = JSON.parse(response.body)
      # puts data
      puts data['instagram']['data'].length

      puts "Found photos for #vaneastvillage"
    end

    def self.from_hash(data)
      self.new(data)
    end

  end
end