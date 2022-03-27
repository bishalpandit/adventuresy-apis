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

-- D-M622

select * from adventures;

insert into partneradventurelink(partner_id, adventure_id)
values('a741a231-d61d-418b-91d4-e8851c901a26','04605ad4-9a2b-4e99-92ba-7d10079d24cf');

select * from partneradventurelink;

select * from adventureprices;

alter table adventureprices
add constraint partadvenlinkfk foreign key(partneradventurelink_id) references partneradventurelink(id);

alter table partneradventurelink
add constraint partadvtlink_pk primary key(id);

select * from adventureprices ap 
join partneradventurelink pal on pal.id = ap.partneradventurelink_id
join partners p on pal.partner_id = p.id
join adventures a on pal.adventure_id = a.id;

update Adventures
set img_link = 'paragliding.jpg'
where title = 'Parasailing in Malaysia';

select title, img_link from adventures;