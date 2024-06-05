# Network

## **Configuring System Network**

### **CLI**

**Step 1**: Open the terminal on your system.

**Step 2**: Run the command to list your network interfaces:

``` 
nmcli device
```
This will show you the names of your network interfaces, e.g. **<span style="color:blue">enp0s3</span>**, **<span style="color:blue">wlp2s0</span>**, etc.

**Step 3**: Run the following command to edit the connection settings for your desired interface  
(replace **<span style="color:blue">enp0s3</span>** with your interface name):
```
nmcli connection edit enp0s3
```
**Step 4**: In the **<span style="color:blue">nmcli</span>** interactive prompt, set the new IP address, subnet mask, gateway, and DNS servers:
```
nmcli> set ipv4.method manual
nmcli> set ipv4.addresses 192.168.1.100/24
nmcli> set ipv4.gateway 192.168.1.1
nmcli> set ipv4.dns 8.8.8.8,8.8.4.4
nmcli> quit
```
**Note**: Replace the IP addresses, subnet mask, gateway, and DNS servers with your desired values.

**Step 5**: Activate the new configuration:
```
nmcli connection up enp0s3
```

**Step 6**: Verify your new IP Address configuration 
```
ip addr show enp0s3
```
If everything went well, you should see your new IP address.

### **GUI**

**Step 1**: **Open Settings:**

   - Click on the system menu at the top right corner of your screen.
   - Select "Settings" from the dropdown menu.

<img src="Screenshot from 2024-06-03 14-54-36.png" width="500" height="500">

**Step 2**: **Navigate to Network Settings:**

   - In the "Settings" window, find and click on the "Network" section on the left sidebar.
   - In the "Network" settings, under the "Wired" section, click on the settings icon (gear icon) next to the "Wired" connection.

<img src="Screenshot from 2024-06-03 14-54-53.png" width="500" height="500">

**Step 3**:  **Network Configuration**

- In the new window that appears, click on the "IPv4" tab to open the IPv4 settings.
- Change the "IPv4 Method" from "Automatic (DHCP)" to "Manual" by selecting the "Manual" radio button.
- Under the "Addresses" section, you need to provide the following information:
     - **Address:** Enter the IP address you want to assign to your machine. For example, `192.168.0.101`.
     - **Netmask:** Enter the subnet mask. In this example, it's `255.255.255.0`.
     - **Gateway:** Enter the gateway address, typically the address of your router. For this example, it is `192.168.0.1`.
- Once you've entered all the necessary information, click the "Apply" button at the top right corner of the window to save the changes.

<img src="Screenshot from 2024-06-03 14-55-05-1.png" width="500" height="500">

**Step 4**: **Reconnect the Wired Connection:**

   - Ensure your cable is plugged in if not already.
   - If the cable is unplugged, plug it back in, and your system should now use the manual IP configuration you set.

## **Connect two Different Network in GPU**

### **CLI**

**Step 1**: **Identify Network Interfaces:**

   - Identify your network interfaces to distinguish between the USB dongle and the LAN connection.

```
ip link show
```
   - **Note:** the interface names (e.g., eth0, eth1, wlan0, usb0).

 **Step 2: Configure Static IP for USB Dongle (Internet Access)**

 Assuming your USB dongle is recognized as usb0, configure it with a static IP address.

   - Open the Netplan configuration file
   
```
sudo nano /etc/netplan/01-netcfg.yaml    
```

   - Add the following configuration for the USB dongle.

```
network:
   version: 2
   ethernets:
      usb0:
      addresses:
         - 192.168.2.10/24    # Example: Replace with your desired static IP address
      gateway4: 192.168.2.1   # Example: Replace with your gateway
      nameservers:
         addresses:
            - 8.8.8.8
            - 8.8.4.4
```

 **Step 3: Configure Static IP for LAN Connection (Camera Access)**

 Assuming your LAN interface is eth0, configure it with a static IP address.
 
   - Open the Netplan configuration file.

```
sudo nano /etc/netplan/01-netcfg.yaml
```
   - Add the following configuration for the LAN connection

```
network:
  version: 2
  ethernets:
    eth0:
      addresses:
        - 192.168.1.10/24     # Example: Replace with your desired static IP address
      gateway4: 192.168.1.1   # Example: Replace with your gateway
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
```

**Step 4: Apply the Netplan Configuration**

   - Apply the Netplan configuration to enable the new network settings.

```
sudo netplan apply
```

**Step 4: Verify Connections**

Ensure both interfaces are correctly configured and active.

   - Check the status of the network interfaces.

```
ip a
```

   - Test the internet connection (via USB dongle).

```
ping -c 4 google.com
```

   - Test the camera network connection (via LAN)

```
ping -c 4 192.168.1.20
```
**Troubleshooting**

If you encounter issues, you can troubleshoot using the following commands:
   - Check Netplan configuration:

```
sudo netplan try
```

   - Restart network services:

```
sudo systemctl restart systemd-networkd
sudo systemctl restart NetworkManager
```

   - Review system logs for network-related errors:

```
sudo journalctl -u systemd-networkd
sudo journalctl -u NetworkManager
```
**Example Netplan Configuration File**

Here is an example of how your /etc/netplan/01-netcfg.yaml file should look with both configurations:

```
network:
  version: 2
  ethernets:
    usb0:
      addresses:
        - 192.168.2.10/24  # Example: Replace with your desired static IP address
      gateway4: 192.168.2.1  # Example: Replace with your gateway
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
    eth0:
      addresses:
        - 192.168.1.10/24  # Example: Replace with your desired static IP address
      gateway4: 192.168.1.1  # Example: Replace with your gateway
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4

```

### **GUI**

**Step 1: Open Network Settings**

   - Click on the Network icon in the system tray.
   - Select Settings.

**Step 2: Configure LAN Connection for Camera Access**

   - Open Wired Settings
   - Click on the gear icon next to your wired connection (e.g., eth0).

<img src="Wired_connection.png" width="500" height="500">

**IPv4 Settings**

   - Go to the IPv4 tab.
   - Select Manual for the IPv4 Method.
   - Under Addresses, enter:
      - **Address**: 192.168.1.10 (Replace with your desired static IP)
      - **Netmask**: 255.255.255.0 (Common subnet mask)
      - **Gateway**: 192.168.1.1 (Your network gateway)
   - Under DNS, enter:
      - 8.8.8.8, 4.2.2.2 (Public DNS servers)
   - Click Apply to save the settings.
 
 <img src="wired_connection_config.png" width="500" height="500">   

**Step 3:  Configure USB Dongle for Internet Access**
   
   - Open USB Ethernet Settings:
      - In the Network settings, find your USB Ethernet connection (it might be listed under a different name depending on your USB dongle).
   - Edit USB Ethernet Connection:
      - Click on the gear icon next to your USB Ethernet connection (e.g., usb0).

 <img src="USB_connection.png" width="500" height="500">

**IPv4 Settings**

   - Select Manual for the IPv4 Method.
   - Under Addresses, enter:
   - Go to the IPv4 tab.
      - **Address**: 192.168.2.10 (Replace with your desired static IP)
      - **Netmask**: 255.255.255.0 (Common subnet mask)
      - **Gateway**: 192.168.2.1 (Your network gateway)
   - Under DNS, enter:
      - 8.8.8.8, 4.2.2.2 (Public DNS servers)
   - Click Apply to save the settings.

<img src="USB _connection_config-1.png" width="500" height="500">

**Step 4: Verify Network Connections**

   - Run the following command in the terminal:

```
ping -c 4 google.com
```

Ensure you receive responses.

   - Test Camera Network Connection (via LAN):
   - Ping the camera's IP address:

```
ping -c 4 <camera-ip-address>
```

   - Replace *camera-ip-address* with the actual IP address of your camera.
