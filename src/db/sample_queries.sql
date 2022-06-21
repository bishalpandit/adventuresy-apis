-- Query for Setting Booking Availability for Adventures w.r.t Partners

select adventure_id, 
(select title from adventures a where a.id = adventure_id ), 
(select summary from adventures a where a.id = adventure_id ), 
(select img_link from adventures a where a.id = adventure_id ) 
from reviews rev 
join reservations res
on rev.reservation_id = res.id 
join partneradventurelink pa 
on res.partneradventurelink_id = pa.id 
join adventures adv
on pa.adventure_id = adv.id 
group by adventure_id
order by avg(rating) desc;

SELECT *
             FROM ADVENTURES
             WHERE id = '2427b7df-f565-426e-a375-b0fb8d2dbcf1';

SELECT *
FROM REVIEWS REV 
JOIN RESERVATIONS RES 
ON REV.reservation_id = RES.id
JOIN PARTNERADVENTURELINK PA 
ON RES.partneradventurelink_id = PA.id
WHERE PA.adventure_id = '2427b7df-f565-426e-a375-b0fb8d2dbcf1';

SELECT avg(rating)
FROM REVIEWS REV 
JOIN RESERVATIONS RES 
ON REV.reservation_id = RES.id
JOIN PARTNERADVENTURELINK PA 
ON RES.partneradventurelink_id = PA.id
WHERE PA.adventure_id = '2427b7df-f565-426e-a375-b0fb8d2dbcf1';

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



insert into partners(pname, address, email)
values('Sky Waltz', 'Jaipur, Rajasthan, India', 'contact@skywaltz.com');

select * from adventures;

select * from partners;
-- D-M622

select * from partneradventurelink pal
join partners p on pal.partner_id = p.id
join adventures a on pal.adventure_id = a.id;

insert into partneradventurelink(partner_id, adventure_id, price)
values('68a19b4e-5ed3-4608-9ef2-981e4f100a61','26eaafe7-1d0e-4458-9381-ff0b124d4ef5', 17000);

// Outbound Id - c1cf0c5b-3136-40f2-9ace-478a9ec4664f
// Alta Advent - a741a231-d61d-418b-91d4-e8851c901a26
// Braver - f519ae65-4bfb-429e-ab64-114a23f4092a
// Sky Waltz - 68a19b4e-5ed3-4608-9ef2-981e4f100a61

select * from partneradventurelink;


alter table adventureprices
add constraint partadvenlinkfk foreign key(partneradventurelink_id) references partneradventurelink(id);

alter table partneradventurelink
add constraint partadvtlink_pk primary key(id);



update Adventures
set img_link = 'paragliding.jpg'
where title = 'Parasailing in Malaysia';



select * from reservations res
join partneradventurelink pa 
on res.partneradventurelink_id = pa.id 
join adventures adv
on pa.adventure_id = adv.id;

select * from users;
select * from partneradventurelink;
select * from reviews;

insert into reservations(user_id, start_date, end_date, persons, price, tax, total, partneradventurelink_id) values('05330f2a-85c5-42ff-8c33-f15e60067fca', '2022-05-01', '2022-05-08', 1, 20000, 400, 20400, '05f1a5dc-bb81-4960-8a0d-6c5151703ce7');

alter table reservations
ADD CONSTRAINT fk_partneradventurelink FOREIGN key(partneradventurelink_id) REFERENCES partneradventurelink(id);

update reviews
set rating = 4.5
where id = '71b455d1-d6f2-49b8-8778-af7d14ce296a';
delete from reviews
where id = 'b8c122ae-7e8d-4edc-90f7-12632a17db81';

update partneradventurelink
set price = 36000
where id = '57ef8f9b-61e2-4672-8f6b-e336774c23e9';


select * from users;

insert into reviews(reservation_id, content, rating)
values('4042f6c3-6418-4d6a-9912-f03441b3f3cc', 'It was really fun but scary also.', 3.5);

SELECT partner_id, price,
(SELECT pname 
FROM PARTNERS
WHERE id = partner_id)
FROM PARTNERADVENTURELINK
WHERE adventure_id = '2427b7df-f565-426e-a375-b0fb8d2dbcf1';



CREATE OR REPLACE FUNCTION updateUserRecommendation(userid uuid) 
   RETURNS JSON
   LANGUAGE PLPGSQL
AS $$

DECLARE
rowCount float:= 0;
water float:= 0;
air float:= 0;
land float:= 0;
Nrecommendation json;
rec record;
BEGIN
    for rec in select count(*), tag_name
           from userlogs
           where user_id = cast(userid as uuid)
           group by tag_name
	loop
		if rec.tag_name = 'water' then
            water := rec.count;
        elsif rec.tag_name = 'air' then
            air := rec.count;
        else 
            land := rec.count;
        end if;
	end loop;
    
    select count(*) into rowCount
    from userlogs
    where user_id = userid;
    
    land := land/rowCount;
    water := water/rowCount;
    air := air/rowCount;
    
    Nrecommendation:= jsonb_build_object('air', air, 'water', water, 'land', land);
    
    if(land != 0 or air != 0 or water != 0) then
        update users
        set recommendation = Nrecommendation
        where user_id = userid;
     end if;
     
     return Nrecommendation;
END; 

$$

SELECT *
FROM USERS;

SELECT 
        id, type, title, summary, address, img_link, tags
        FROM ADVENTURES A
        WHERE A.address ILIKE 'A'
        OR A.type ILIKE 'A'
        UNION
        SELECT id, type, title, summary, address, img_link, tags
        FROM ADVENTURES A
        WHERE id in (
        SELECT adventure_id
        FROM PARTNERADVENTURELINK PAL
        WHERE partner_id in (
        SELECT id
        FROM PARTNERS P
        WHERE P.pname ILIKE '%Alt%'
        ));

        
select count(*), type
from adventures
group by type;


update adventures
set type = 'Air Ballon'
where id = '354b75c4-2034-4d61-bbeb-bd61e1b40a09';
select *
from adventures;