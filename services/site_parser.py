import requests


async def parse_website(nowTime):
    try:
        transports = []
        url = f"https://m.marsruti.lv/liepaja/gps.txt?{nowTime}"
        response = requests.get(url)
        response.raise_for_status()  # Check if the request was successful
        response_list = response.text.split('\n')


        print(len(response_list), "transports received")
        for line in response_list:
            if line:
                params = line.split(',')
                lat = float(params[2]) / 10**6
                long = float(params[3]) / 10**6
                new_transport = {
                    "route": params[1], # route
                    "lat": lat, # lat
                    "long": long, # long
                    "azimuth": params[5], # speed
                    "number": params[6] # number
                }
                transports.append(new_transport)
        return transports

    except Exception as e:
        print(f"An error occurred: {e}")
        return []