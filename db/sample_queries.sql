-- Query for Setting Booking Availability for Adventures w.r.t Partners

insert into bookingavailability(partner_id, adventure_id, avail_dates)
values('f519ae65-4bfb-429e-ab64-114a23f4092a','2427b7df-f565-426e-a375-b0fb8d2dbcf1', 
	   ARRAY[date('2022-03-12'),
	   	date('2022-03-15'),
	   	date('2022-03-16'),
	   	date('2022-03-20')
	   ]);

select a.title, p.name, ba.avail_dates from bookingavailability ba
join partners p on p.id = ba.partner_id
join adventures a on a.id = ba.adventure_id;

select * from partners;

select * from adventures;
